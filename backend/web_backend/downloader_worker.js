const workerpool = require('workerpool');
const vision = require('@google-cloud/vision');
const child_process =require('child_process');
//var worker = require('child_process');
var fs = require('fs')
const ls_and_label =  (vid_id)=>{
  return new Promise((resolve,reject)=>{
        console.log(`worker processing video ${vid_id} closed. now finding the paths for gcp...`)
            sortedPath =[];
            const createSorted = child_process.exec(`ls $(pwd)/frames/img-${vid_id}*| sort`);
            createSorted.stderr.on('data', (data)=>{
                console.error("FIND ERR TING", data.toString);
            })
            createSorted.stdout.on('data', (filepath)=>{
                sortedPath.push(filepath.toString);
            })
            createSorted.stdout.on('close', () =>  {   
            console.log(`worker processing video ${vid_id} closed path finding. Now doing label detection in GCP...`)
                const client = new vision.ImageAnnotatorClient();
                Promise.all(
                    sortedPath.map((path=>client.labelDetection(path)))
                ).then((aggregatedResults)=>{
                    console.log(`worker processing video ${vid_id} Done. Finally exiting.....`)
                    let full_video_sentence = aggregatedResults.map(results=>{
                        //do something with this individual result.
                            const labels = results[0].labelAnnotations.join(" ");
                            return labels;
                    }).join(" ");
                    resolve(full_video_sentence);
                })
            })
  });
}
const work = (vid_id)=>{
    return new Promise((resolve,reject)=>{
        if(fs.existsSync(__dirname,"frames",`img-${vid_id}-001.jpg`)){
        console.log(`worker no need to process video ${vid_id}. ls and labelling with gcp..`)
          return ls_and_label(vid_id);
        }else{
        console.log(`worker processing video ${vid_id}`)
        let work_process = child_process.spawn("./ytdl.sh",[vid_id]);
        work_process.on('error', (err)=>{
            console.log(err);
            reject(err);
            return;
        })
        work_process.on('close',(code)=>{
          return ls_and_label(vid_id);
    })
        
        }
    })
};
workerpool.worker({
    process_video: work
})
