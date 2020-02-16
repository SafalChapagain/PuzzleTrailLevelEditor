
var gameObjects = [];

class Point
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}

class GameObject
{
  

  constructor(id, x, y)
  {
    this.id = id;
    this.x = x;
    this.y = y;
    this.blackTint = 255;

    gameObjects.push(this);
  }

  draw()
  { 
    tint(this.blackTint, this.blackTint, this.blackTint);
    image(idToTexture(this.id), 32 * this.x, 32 * this.y);
    tint(255, 255);


    if (this.blackTint < 255)
      this.blackTint += 8;
    else
      this.blackTint = 255;
  }
}

function idToTexture(objectid)
{
  switch (objectid)
  {
    case "w":
      return w;
    case "c1":
      return c1;
    case "c2":
      return c2;
    case "c3":
      return c3;
    case "c4":
      return c4;
    case "c5":
      return c5;
    case "c6":
      return c6;
    case "c7":
      return c7;
    case "c8":
      return c8;
    case "p1":
      return p1;
    case "p2":
      return p2;
    case "p3":
      return p3;
    case "p4":
      return p4;
    case "p5":
      return p5;
    case "p6":
      return p6;
    case "p7":
      return p7;
    case "p8":
      return p8;
  }
}

let c1, c2, c3, c4, p1, p2, p3, p4, w;

function preload()
{
  c1 = loadImage("c1.png");
  c2 = loadImage("c2.png");
  c3 = loadImage("c3.png");
  c4 = loadImage("c4.png");
  c5 = loadImage("c5.png");
  c6 = loadImage("c6.png");
  c7 = loadImage("c7.png");
  c8 = loadImage("c8.png");
  p1 = loadImage("p1.png");
  p2 = loadImage("p2.png");
  p3 = loadImage("p3.png");
  p4 = loadImage("p4.png");
  p5 = loadImage("p5.png");
  p6 = loadImage("p6.png");
  p7 = loadImage("p7.png");
  p8 = loadImage("p8.png");
  w = loadImage("w.png");
}

let currentObject = "p";
let currentIndex = 1;

function getCurrentId()
{
  return currentObject + (currentObject !== "w" ? currentIndex : "");
}

function changeObject()
{
  if (currentObject === "p")
  {
    currentObject = "c";
  }
  else if (currentObject === "c")
  {
    currentObject = "w";
  }
  else if (currentObject === "w")
  {
    currentObject = "p";
  }
}

function clearMap()
{
  gameObjects = [];
}


function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


function exportMap()
{
  let mapText = "";

  for (let y = 0; y < sizeY; y++)
  {
    for (let x = 0; x < sizeX; x++)
    {
      let obj = objectInPosition(new Point(x, y));
      if (obj)
      {
        mapText += obj.id;
      }
      else
      {
        mapText += "."
      }
      if (x !== sizeX - 1)
      {
        mapText += " ";
      }
    }
    if (y !== sizeY - 1)
    {
      mapText += "\n";
    }
  }

  if (!currentFile)
    download("map_0.txt", mapText);
  else
    download(currentFile.name, mapText);  
}

let currentFile;

function selectMap(file)
{
  currentFile = file;
}

function importMap()
{
  if (currentFile.type === "text")
  {
    clearMap();
    try
    {
      let x = 0;
      let y = 0;
      for (let line of currentFile.data.split("\n"))
      {
        x = 0;
        for (let objTxt of line.trim().split(" "))
        {
          if (objTxt !== ".")
            gameObjects.push(new GameObject(objTxt, x, y));
          x++;
        }
        y++;
      }
  
      sizeXSlider.value(x);
      sizeYSlider.value(y);
    }
    catch
    {
      console.log("error loading map");
    }

  }
}

function objectInPosition(pos)
{
  for (let i of gameObjects)
  {
    if (i.x === pos.x && i.y === pos.y)
      return i;
  }
  return false;
}

function objectExists(id)
{
  for (let i of gameObjects)
  {
    if (i.id === id)
      return i;
  }
  
  return false;
}

let sizeX = 12;
let sizeY = 12;

var canvas, infoText, objectButton, indexSlider, sizeXSlider, sizeYSlider, clearButton, exportButton, exportA, sizeText, importInput, importButton;

function setup() {
  sizeText = createP();
  sizeXSlider = createSlider(2, 32, 8, 1);
  sizeYSlider = createSlider(2, 32, 8, 1);

  sizeText.position(140, 0);
  sizeXSlider.position(0, 0);
  sizeYSlider.position(0, 30);


  canvas = createCanvas(sizeX * 32, sizeY * 32);
  
  canvas.position(240, 0);

  infoText = createP();
  objectButton = createButton("Change Object");
  indexSlider = createSlider(1, 8, 1, 1);
  clearButton = createButton("Clear");
  exportButton = createButton("Export");
  importInput = createFileInput(selectMap);
  importButton = createButton("Import");

  infoText.position(0, 40);
  objectButton.position(0, 80);
  indexSlider.position(0, 100);
  clearButton.position(0, 260);
  exportButton.position(0, 140);
  importInput.position(0, 170);
  importButton.position(0, 190);

  objectButton.mousePressed(changeObject);
  clearButton.mousePressed(clearMap);
  exportButton.mousePressed(exportMap);
  importButton.mousePressed(importMap);


}

function getGridPos(x, y)
{
  return new Point(Math.floor(x / 32), Math.floor(y / 32));
}

let editScale = 1;

function draw() {
  sizeX = sizeXSlider.value();
  sizeY = sizeYSlider.value();
  sizeText.html(`(${sizeX}, ${sizeY})`);

  currentIndex = indexSlider.value();

  if (sizeX > 16 || sizeY > 16)
  {
    editScale = 1;
    canvas.style("border: 32px solid #767476;");
  }
  else
  {
    editScale = 2;
    canvas.style("border: 64px solid #767476;")
  }

  
  resizeCanvas(sizeX * 32 * editScale, sizeY * 32 * editScale);
  scale(editScale);
  background(192);


  infoText.html(`${getCurrentId()}`);
  tint(255, 255);
  for (let i of gameObjects)
  {
    i.draw();
  }


  tint(255, 80);
  let pos = getGridPos((mouseX - 32 * editScale) / editScale, (mouseY - 32 * editScale) / editScale);
  

  if (pos.x >= 0 && pos.x < sizeX && pos.y >= 0 && pos.y < sizeY)
  {
    let obj = objectInPosition(pos);

    if (!obj)
    {
      image(idToTexture(getCurrentId()), pos.x * 32, pos.y * 32);
    }
  
    if (mouseIsPressed)
    {
      if (!obj && !keyIsDown(SHIFT))
      {
        let existingObj = objectExists(getCurrentId());
        if (!existingObj || currentObject === "w")
        {
          new GameObject(getCurrentId(), pos.x, pos.y);
        }
        else 
        {
          if (currentObject !== "w" && existingObj.blackTint === 255)
            existingObj.blackTint = 8;
        }
      }
      else
      {
        if (keyIsDown(SHIFT))
        {
          gameObjects = gameObjects.filter(el => el !== obj);
          delete obj;
        }
      }
    }
  }

  let bad = [];
  for (let i of gameObjects)
  {
    if (i.x > sizeX || i.y > sizeY || i.x < 0 || i.y < 0)
    {
      bad.push(i);
    }
  }

  for (let i of bad)
  {
    gameObjects = gameObjects.filter(el => el !== i);
    delete i;
  }

    
  tint(255, 255);
}