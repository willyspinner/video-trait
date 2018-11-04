const workerpool = require('workerpool');
const vision = require('@google-cloud/vision');
const child_process =require('child_process');
//var worker = require('child_process');
const work = (vid_id)=>{
    return new Promise((resolve,reject)=>{
        console.log(`worker processing video ${vid_id}`)
        let work_process = child_process.spawn("./ytdl.sh",[vid_id]);
        work_process.on('error', (err)=>{
            console.log(err);
            reject(err);
            return;
        })
        work_process.on('close',(code)=>{
        console.log(`worker processing video ${vid_id} closed. now finding the paths for gcp...`)
            if (code !== 0){
                //handle here.
                reject(code);
                return;
            }
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
    })
    })
};
workerpool.worker({
    process_video: work
})
