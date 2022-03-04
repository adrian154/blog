document.querySelectorAll(".t-plot").forEach(tplot => {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 150;
    tplot.append(canvas);

});

document.querySelectorAll(".normal-plot").forEach(normalPlot => {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 150;
    normalPlot.append(canvas);

});

document.querySelectorAll(".boxplot").forEach(boxplot => {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 150;
    boxplot.append(canvas);

});