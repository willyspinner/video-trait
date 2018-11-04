const workerpool = require('workerpool');
const vision = require('@google-cloud/vision');
const child_process =require('child_process');
//var worker = require('child_process');
const work = (vid_id)=>{
    return new Promise((resolve,reject)=>{
        let work_process = child_process.spawn("./ytdl.sh",[vid_id]);
        work_process.on('error', (err)=>{
            console.log(err);
            reject(err);
            return;
        })
        work_process.on('close',(code)=>{
            if (code !== 0){
                //handle here.
                reject(code);
                return;
            }
            sortedPath =[];
            const createSorted = spawn(`find $(pwd)/frames -max-depth 1 -type f | sort`);
            createSorted.stdout.on('data', (filepath)=>{
                sortedPath.append(filepath.toString);
            })
            createSorted.stdout.on('close', () =>  {   
                const client = new vision.ImageAnnotatorClient();
                Promise.all(
                    sortedPath.map((path=>client.labelDetection(path)))
                ).then((aggregatedResults)=>{
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