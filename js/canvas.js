var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var colorri = document.getElementById('color');
var valeurManuelle = document.getElementById('valeurManuelle');
var texte = "DMS";
var check = true;


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = colorri.value;
  ctx.strokeStyle = "#5034e0";
  ctx.lineWidth = choix.value;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = slider.value;
  ctx.shadowOffsetY = slider.value;
  if(!check)
    ctx.shadowColor = 'transparent';

  ctx.beginPath();
  ctx.moveTo(500-20, 500-20);
  ctx.lineTo(20, 500-20);
  ctx.lineTo(500/2, 20);
  ctx.bezierCurveTo(500-20, 20, 500/2, 500-20, 500-20, 500-20);
  ctx.lineTo(20, 500-20);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  ctx.fillStyle = "#e034b3";
  ctx.beginPath();
  ctx.moveTo(500-20, 500-20);
  ctx.lineTo(20, 500-20);
  ctx.bezierCurveTo(500/2, 20, 20, 500-20, 500-20, 500-20);
  ctx.lineTo(20, 500-20);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  ctx.fillStyle = "#ffffff";
  ctx.font = Math.floor((500/3)-(500/10))+'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(texte, (500/2), 500/2);
  texte = "DMS";
}
 
draw();

colorri.addEventListener('change', draw);
slider.addEventListener('input', draw);

valeurManuelle.addEventListener('input', function() {
    let i;
    for(i = 0; i < texte.length; i++)
    {
        if(texte.charAt(i) == valeurManuelle.value.trim())
        {
            switch(i)
            {
                case 0 :
                    texte = "MS";
                    break;
                case 1 :
                    texte = "DS";
                    break;
                case 2 :
                    texte = "DM";
                    break;
            }
        }
    }
    draw();
});

choix.addEventListener('change', draw);

bouton.addEventListener("click", function(){
    check = !check;
    draw();
});

