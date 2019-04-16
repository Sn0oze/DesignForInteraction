import { CountUp } from './lib/countUp.min.js';

const scoreKey = "score";
const pointsKey = "points";


let score = getScore();

let points = getPoints();

const options = {
    startVal: score,
    separator: '.',
    decimal: ',',
};

$("#score").text(score);
let counter = new CountUp('score', score, options);
counter.start();

if(!isNaN(points)){
    score +=points;
    setScore(score);
    setTimeout(()=> {
        $("#points").text("+" + points);
        $("#points").css("visibility", "visible");
        counter.update(score)
    }, 200);
}

$('#introductionCarousel').on('slide.bs.carousel',function(e){
    let slideFrom = $(this).find('.active').index();
    let slideTo = $(e.relatedTarget).index();
    const step2 = 1;
    if(slideTo === step2 && score === 0){
        $("#openScannerBtn").addClass("animated pulse infinite beacon");
    }
    else{
        $("#openScannerBtn").removeClass("animated pulse infinite beacon");
    }
});


function getPoints(){
    let points = parseInt(localStorage.getItem(pointsKey));
    // reset between games
    localStorage.removeItem(pointsKey);
    return points
}

function getScore() {
    return parseInt(localStorage.getItem(scoreKey)) || 0;

}

function setScore(value){
    localStorage.setItem(scoreKey, value);
}