const workerpool = require('workerpool');
const vision = require('@google-cloud/vision');
const child_process =require('child_process');
//var worker = require('child_process');
var path = require('path');
var fs = require('fs')
const ls_and_label =  (vid_id)=>{
  return new Promise((resolve,reject)=>{
        console.log(`worker processing video ${vid_id} closed. now finding the paths for gcp...`)
            sortedPath =[];
            const createSorted = child_process.exec(`ls $(pwd)/frames/img-${vid_id}*| sort`);
            createSorted.stderr.on('data', (data)=>{
                console.error("FIND ERR TING", data.toString);
            })
            createSorted.stdout.on('data', (filepaths)=>{
		filepaths.split("\n").forEach((fp)=>{
                console.error("PUSHING", fp);
			sortedPath.push(fp);
		});
            });
            createSorted.stdout.on('close', () =>  {   
            console.log(`worker processing video ${vid_id} closed path finding. Now doing label detection in GCP...`);
		const client = new vision.ImageAnnotatorClient();
                Promise.all(
                    sortedPath.slice(0,5).map(sP=> new Promise((resolve2,reject2)=>{
			//console.log("analyzing img : ",sP);
			client.labelDetection(sP,(err,results)=>{
				//console.log("err res ",err,results);	
				if( err){
					reject2(err);
					return;
				}else 
					resolve2(results);
				})
			})
		    )
                ).then((aggregatedResults)=>{
			// aggregatedresults is the images of a video  in chron order.
			// each img has a annotation. array of image-words.
                    console.log(`worker processing video ${vid_id} Done. agregating results........`)
                    let full_video_sentence = aggregatedResults.map(results=>{
                        //do something with this individual result.
                            const labels = results/*[0]*/.labelAnnotations.map(entry=>entry.description).join(" ");
				console.log("labels: " , labels);
                            return labels;

                    }).join(" ");
                    console.log(`worker processing video ${vid_id} resolving with sentence: ${full_video_sentence}..`)
                    resolve(full_video_sentence);
			return;
                })
            })
  });
}
const work = (vid_id)=>{
    return new Promise((resolve,reject)=>{
        if(fs.existsSync(path.join(__dirname,"frames",`img-${vid_id}-001.jpg`))){
        console.log(`worker no need to process video ${vid_id}. ls and labelling with gcp..`)
          //return ls_and_label(vid_id);
          ls_and_label(vid_id).then((result)=>{resolve(result)});
        }else{
        console.log(`worker processing video ${vid_id}`)
        let work_process = child_process.spawn("./ytdl.sh",[vid_id]);
        work_process.on('error', (err)=>{
            console.log(err);
            reject(err);
            return;
        })
        work_process.on('close',(code)=>{
          ls_and_label(vid_id).then((result)=>{resolve(result)});
    })
        
        }
    })
};
workerpool.worker({
    process_video: work
})
