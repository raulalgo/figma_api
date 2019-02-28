var express = require('express');
var fetch = require('isomorphic-fetch');

const FigmaAPIKey = '8790-0b07bae2-7cc1-41b3-8d36-3ecaf5dcd6cd';
const FigmaFileID = `0tezohkSt5NUeR9GdjnbJPjc`;

async function figmaFileFetch(fileId) {
    let result = await fetch('https://api.figma.com/v1/files/' + fileId , {
        method: 'GET',
        headers: {
            'X-Figma-Token': FigmaAPIKey
        }
    })
    
    let figmaFileStruct = await result.json();
    // return figmaFileStruct;
    let figmaFrames = figmaFileStruct.document.children
        .filter(child => child.type === 'CANVAS')[0].children
        .filter(child => child.type === 'FRAME')
        .map(frame => {
            return {
                name: frame.name,
                id: frame.id
            }
        })

    let ids = figmaFrames.map(comp => comp.id).join(',')
    console.log('ids: '+ ids)

    let imageResult = await fetch('https://api.figma.com/v1/images/' + fileId + '?scale=3&ids=' + ids, { //2
        method: 'GET', //2
        headers: { 
            'X-Figma-Token': FigmaAPIKey //2
        }
    }).catch(error => console.log(error))

    let figmaImages = await imageResult.json()

    figmaImages = figmaImages.images
    console.log(JSON.stringify(figmaImages));

    return figmaFrames.map(frame => {
        return {
            name: frame.name,
            url: figmaImages[frame.id]
        }
    });
}

var app = express();

// app.use('/', async function(req,res,next) {
//     let result = await figmaFileFetch(FigmaFileID).catch(error => console.log(error))
//     res.send(JSON.stringify(result))
// })


app.use('/frames', async function(req, res, next){
    let result = await figmaFileFetch(FigmaFileID).catch(error => console.log(error))
    res.send(result)
})


app.listen(3013,console.log("I'm a server listening on 3013"));

