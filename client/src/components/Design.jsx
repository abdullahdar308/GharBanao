import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { jsPDF } from "jspdf";
import { useAuth } from "../contexts/AuthContext";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import alertIcon from "../assets/alertIcon.svg";

import wall from "../assets/Design-SVGs/WallIcon.svg";
import door from "../assets/Design-SVGs/doorIcon.svg";
import doubledoor from "../assets/Design-SVGs/DoubledoorIcon.svg";
import windowIcon from "../assets/Design-SVGs/WindowIcon.svg";
import bed from "../assets/Design-SVGs/Bed.svg";
import car from "../assets/Design-SVGs/Car.svg";
import chair from "../assets/Design-SVGs/Chair.svg";
import bathtub from "../assets/Design-SVGs/bathtub.svg";
import couch from "../assets/Design-SVGs/Couch.svg";
import dinnerTable from "../assets/Design-SVGs/DinnerTable.svg";
import toilet from "../assets/Design-SVGs/Toilet.svg";
import sink from "../assets/Design-SVGs/sink.svg";
import stove from "../assets/Design-SVGs/Stove.svg";
import stairs from "../assets/Design-SVGs/Stairs.svg";
import table from "../assets/Design-SVGs/Table.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import rotateIcon from "../assets/rotateIcon.svg";
import undoIcon from "../assets/undoIcon.svg";
import zoomInIcon from "../assets/zoomInIcon.svg";
import zoomOutIcon from "../assets/zoomOutIcon.svg";
import resetZoomIcon from "../assets/resetZoomIcon.svg";
import exportIcon from "../assets/exportIcon.svg";
import Navigation from "./Navigation";

const Design = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDoorDropdownOpen, setIsDoorDropdownOpen] = useState(false);
  const [isFurnitureDropdownOpen, setIsFurnitureDropdownOpen] = useState(false);
  const [selectedObjectDetails, setSelectedObjectDetails] = useState(null);
  const [area, setArea] = useState("");
  const [isBoundaryVisible, setIsBoundaryVisible] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const COLORS = ["#468378", "#2C3433", "#A8B0AF"];

  const divRef = useRef(null);
  const [divWidth, setDivWidth] = useState(0);
  const [boundary, setBoundary] = useState({
    x: 0,
    y: 0,
    width: 700, // Initial value will be updated
    height: 660,
  });
  // Update boundary when divWidth changes
  useEffect(() => {
    setBoundary((prev) => ({
      ...prev,
      width: divWidth,
    }));
  }, [divWidth]);

  useEffect(() => {
    if (divRef.current) {
      setDivWidth(divRef.current.clientWidth);
      setBoundary((prev) => ({ ...prev, width: divRef.current.clientWidth }));
    }

    const handleResize = () => {
      if (divRef.current) {
        const newWidth = divRef.current.clientWidth;
        // setDivWidth(newWidth);
        setBoundary((prev) => ({ ...prev, width: newWidth }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDoorDropdown = () => setIsDoorDropdownOpen((prev) => !prev);
  const toggleFurnitureDropdown = () =>
    setIsFurnitureDropdownOpen((prev) => !prev);

  // const boundary = {
  //   x: 50,
  //   y: 50,
  //   width: 700,
  //   height: 700,
  // };

  const [actionStack, setActionStack] = useState([]);

  useEffect(() => {
    if (canvasRef.current && !canvas && divWidth > 0) {
      try {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: divWidth,
          height: boundary.height, // Use boundary.height instead of fixed 700
          backgroundColor: "#fff",
          preserveObjectStacking: true,
        });
        fabricCanvas.on("object:added", (e) => {
          const object = e.target;
          object.set({
            borderColor: "green",
            cornerColor: "red",
            cornerStrokeColor: "red",
            borderScaleFactor: 2,
            cornerSize: 8,
          });
          fabricCanvas.renderAll();
        });

        const boundaryRect = new fabric.Rect({
          left: boundary.x,
          top: boundary.y,
          width: boundary.width,
          height: boundary.height,
          stroke: "black",
          strokeWidth: 1,
          fill: "transparent",
          selectable: false,
          visible: false,
        });
        fabricCanvas.add(boundaryRect);
        fabricCanvas.boundaryRect = boundaryRect;

        const gridSize = 15;
        const gridLines = [];

        // Get canvas dimensions
        const canvasWidth = fabricCanvas.width;
        const canvasHeight = fabricCanvas.height;

        // Create vertical grid lines
        for (let i = gridSize; i < divWidth; i += gridSize) {
          const verticalLine = new fabric.Line([i, 0, i, boundary.height], {
            stroke: "#ddd",
            selectable: false,
            visible: false,
            isGrid: true,
            isVertical: true, // Custom property
            initialX: i, // Store initial position
          });
          gridLines.push(verticalLine);
          fabricCanvas.add(verticalLine);
        }

        // Create horizontal grid lines
        for (let j = gridSize; j < boundary.height; j += gridSize) {
          const horizontalLine = new fabric.Line([0, j, divWidth, j], {
            stroke: "#ddd",
            selectable: false,
            visible: false,
            isGrid: true,
            isVertical: false, // Custom property
            initialY: j, // Store initial position
          });
          gridLines.push(horizontalLine);
          fabricCanvas.add(horizontalLine);
        }

        // Function to show grid
        const showGrid = () => {
          gridLines.forEach((line) => line.set({ visible: true }));
          fabricCanvas.renderAll();
        };

        // Function to hide grid
        const hideGrid = () => {
          gridLines.forEach((line) => line.set({ visible: false }));
          fabricCanvas.renderAll();
        };

        // Event listeners for object selection
        fabricCanvas.on("selection:created", showGrid);
        fabricCanvas.on("selection:updated", showGrid);
        fabricCanvas.on("selection:cleared", hideGrid);

        fabricCanvas.on("object:selected", (e) => {
          setSelectedShape(e.target);
        });

        setCanvas(fabricCanvas);
      } catch (error) {
        console.error("Error initializing the canvas:", error);
      }
    }

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvas, divWidth]);

  // Then update your resize handler useEffect
  useEffect(() => {
    if (!canvas || !canvas.lowerCanvasEl || divWidth <= 0) return; // Ensure canvas is initialized

    // Store current state before changes
    const originalZoom = canvas.getZoom();
    const originalPan = canvas.viewportTransform;

    // Update canvas dimensions
    canvas.setDimensions({
      width: divWidth,
      height: boundary.height,
    });

    // Reset zoom and pan after resize
    canvas.setZoom(originalZoom);
    canvas.viewportTransform = originalPan;
    canvas.calcOffset(); // Recalculate offsets

    // Update boundary rectangle
    if (canvas.boundaryRect) {
      canvas.boundaryRect.set({
        width: divWidth,
        height: boundary.height,
      });
      canvas.boundaryRect.setCoords();
    }

    // Update grid lines
    canvas.forEachObject((obj) => {
      if (obj.isGrid) {
        if (obj.isVertical) {
          obj.set({
            x1: obj.initialX,
            x2: obj.initialX,
            y2: boundary.height,
          });
        } else {
          obj.set({
            y1: obj.initialY,
            y2: obj.initialY,
            x2: divWidth,
          });
        }
        obj.setCoords();
      }
    });

    canvas.renderAll();
  }, [divWidth, canvas, boundary.height]);

  const addWall = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const wallImage = new Image();
    wallImage.src = wall;

    wallImage.onload = () => {
      const fabricImg = new fabric.FabricImage(wallImage, {
        left: randomLeft,
        top: randomTop,
        id: `wall-${Date.now()}`,
        selectable: true,
        lockScalingY: true,
        evented: true, // Ensures the object responds to events
        hasControls: true, // Adds resize and rotate controls to the object
        hasBorders: true, // Add borders for visual selection
      });

      fabricImg.customType = "Wall";
      fabricImg.baseCostPerPixel = 27;
      fabricImg.scaleToWidth(400); // Set desired width
      fabricImg.scaleToHeight(15); // Set desired height
      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      console.log("Wall SVG added to canvas");

      fabricImg.on("selected", () => console.log("Image selected!"));

      // Add to action stack
      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    wallImage.onerror = (error) => {
      console.error("Failed to load wall image:", error);
    };
  };

  const addDoor = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const doorImage = new Image();
    doorImage.src = door;

    doorImage.onload = () => {
      const fabricImg = new fabric.Image(doorImage, {
        left: randomLeft,
        top: randomTop,
        id: `door-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Door";
      fabricImg.cost = 15000;
      fabricImg.scaleToWidth(50);
      fabricImg.scaleToHeight(100);
      canvas.add(fabricImg);
      console.log("Door SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    doorImage.onerror = (error) => {
      console.error("Failed to load door image:", error);
    };
  };

  const addDoubleDoor = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const doubleDoorImage = new Image();
    doubleDoorImage.src = doubledoor;

    doubleDoorImage.onload = () => {
      const fabricImg = new fabric.Image(doubleDoorImage, {
        left: randomLeft,
        top: randomTop,
        id: `doubledoor-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Double Door";
      fabricImg.cost = 25000;
      fabricImg.scaleToWidth(100);
      fabricImg.scaleToHeight(100);
      canvas.add(fabricImg);
      console.log("Double Door SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    doubleDoorImage.onerror = (error) => {
      console.error("Failed to load double door image:", error);
    };
  };

  const addBed = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const bedImage = new Image();
    bedImage.src = bed;

    bedImage.onload = () => {
      const fabricImg = new fabric.Image(bedImage, {
        left: randomLeft,
        top: randomTop,
        id: `bed-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Bed";
      fabricImg.cost = 60000;
      fabricImg.scaleToWidth(100);
      fabricImg.scaleToHeight(100);
      canvas.add(fabricImg);
      console.log("Bed SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    bedImage.onerror = (error) => {
      console.error("Failed to load bed image:", error);
    };
  };

  const addStairs = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const stairsImage = new Image();
    stairsImage.src = stairs;

    stairsImage.onload = () => {
      const fabricImg = new fabric.Image(stairsImage, {
        left: randomLeft,
        top: randomTop,
        id: `stairs-${Date.now()}`,
        selectable: true,
        evented: true,
      });
      fabricImg.customType = "Stairs";
      fabricImg.cost = 70000;
      fabricImg.scaleToWidth(50);
      fabricImg.scaleToHeight(200);
      canvas.add(fabricImg);
      fabricImg.bringToFront();
      fabricImg.set({ selectable: true, evented: true });
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    stairsImage.onerror = (error) => {
      console.error("Failed to load stairs image:", error);
    };
  };

  const addTable = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const tableImage = new Image();
    tableImage.src = table;

    tableImage.onload = () => {
      const fabricImg = new fabric.Image(tableImage, {
        left: randomLeft,
        top: randomTop,
        id: `table-${Date.now()}`,
        selectable: true,
        evented: true,
      });
      fabricImg.customType = "Table";
      fabricImg.cost = 18000;
      fabricImg.scaleToWidth(50);
      fabricImg.scaleToHeight(200);
      canvas.add(fabricImg);
      fabricImg.bringToFront();
      fabricImg.set({ selectable: true, evented: true });
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    tableImage.onerror = (error) => {
      console.error("Failed to load table image:", error);
    };
  };

  const addChair = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const chairImage = new Image();
    chairImage.src = chair;

    chairImage.onload = () => {
      const fabricImg = new fabric.Image(chairImage, {
        left: randomLeft,
        top: randomTop,
        id: `chair-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Chair";
      fabricImg.cost = 7000;
      fabricImg.scaleToWidth(50);
      fabricImg.scaleToHeight(50);
      canvas.add(fabricImg);
      console.log("Chair SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    chairImage.onerror = (error) => {
      console.error("Failed to load chair image:", error);
    };
  };

  const addCouch = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const couchImage = new Image();
    couchImage.src = couch;

    couchImage.onload = () => {
      const fabricImg = new fabric.Image(couchImage, {
        left: randomLeft,
        top: randomTop,
        id: `couch-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Couch";
      fabricImg.cost = 30000;
      fabricImg.scaleToWidth(150);
      fabricImg.scaleToHeight(100);
      canvas.add(fabricImg);
      console.log("Couch SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    couchImage.onerror = (error) => {
      console.error("Failed to load couch image:", error);
    };
  };

  const addDinnerTable = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const dinnerTableImage = new Image();
    dinnerTableImage.src = dinnerTable;

    dinnerTableImage.onload = () => {
      const fabricImg = new fabric.Image(dinnerTableImage, {
        left: randomLeft,
        top: randomTop,
        id: `dinnerTable-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Dinner Table";
      fabricImg.cost = 40000;
      fabricImg.scaleToWidth(150);
      fabricImg.scaleToHeight(100);
      canvas.add(fabricImg);
      console.log("Dinner Table SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    dinnerTableImage.onerror = (error) => {
      console.error("Failed to load dinner table image:", error);
    };
  };

  const addToilet = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const toiletImage = new Image();
    toiletImage.src = toilet;

    toiletImage.onload = () => {
      const fabricImg = new fabric.Image(toiletImage, {
        left: randomLeft,
        top: randomTop,
        id: `toilet-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Toilet";
      fabricImg.cost = 15000;
      fabricImg.scaleToWidth(50);
      fabricImg.scaleToHeight(50);
      canvas.add(fabricImg);
      console.log("Toilet SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    toiletImage.onerror = (error) => {
      console.error("Failed to load toilet image:", error);
    };
  };

  const addSink = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const sinkImage = new Image();
    sinkImage.src = sink;

    sinkImage.onload = () => {
      const fabricImg = new fabric.Image(sinkImage, {
        left: randomLeft,
        top: randomTop,
        id: `sink-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Sink";
      fabricImg.cost = 8000;
      fabricImg.scaleToWidth(80);
      fabricImg.scaleToHeight(80);
      canvas.add(fabricImg);
      console.log("Sink SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    sinkImage.onerror = (error) => {
      console.error("Failed to load sink image:", error);
    };
  };

  const addStove = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const stoveImage = new Image();
    stoveImage.src = stove;

    stoveImage.onload = () => {
      const fabricImg = new fabric.Image(stoveImage, {
        left: randomLeft,
        top: randomTop,
        id: `stove-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Stove";
      fabricImg.cost = 22000;
      fabricImg.scaleToWidth(100);
      fabricImg.scaleToHeight(80);
      canvas.add(fabricImg);
      console.log("Stove SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    stoveImage.onerror = (error) => {
      console.error("Failed to load stove image:", error);
    };
  };

  const addBathtub = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const bathtubImage = new Image();
    bathtubImage.src = bathtub;

    bathtubImage.onload = () => {
      const fabricImg = new fabric.Image(bathtubImage, {
        left: randomLeft,
        top: randomTop,
        id: `bathtub-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Bath Tub";
      fabricImg.cost = 60000;
      fabricImg.scaleToWidth(150);
      fabricImg.scaleToHeight(80);
      canvas.add(fabricImg);
      console.log("Bathtub SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    bathtubImage.onerror = (error) => {
      console.error("Failed to load bathtub image:", error);
    };
  };

  const addCar = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const carImage = new Image();
    carImage.src = car;

    carImage.onload = () => {
      const fabricImg = new fabric.Image(carImage, {
        left: randomLeft,
        top: randomTop,
        id: `car-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Car";
      fabricImg.cost = 2000000;
      fabricImg.scaleToWidth(100);
      fabricImg.scaleToHeight(100);
      canvas.add(fabricImg);
      console.log("Car SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    carImage.onerror = (error) => {
      console.error("Failed to load car image:", error);
    };
  };

  const addWindow = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const windowImage = new Image();
    windowImage.src = windowIcon;

    windowImage.onload = () => {
      const fabricImg = new fabric.Image(windowImage, {
        left: randomLeft,
        top: randomTop,
        id: `window-${Date.now()}`,
        selectable: true,
      });
      fabricImg.customType = "Window";
      fabricImg.cost = 12000;
      fabricImg.scaleToWidth(50);
      fabricImg.scaleToHeight(50);
      canvas.add(fabricImg);
      console.log("Window SVG added to canvas");

      setActionStack((prevStack) => [
        ...prevStack,
        { type: "add", object: fabricImg },
      ]);
    };

    windowImage.onerror = (error) => {
      console.error("Failed to load window image:", error);
    };
  };

  const addText = () => {
    if (!canvas) return;

    const randomLeft = Math.random() * (boundary.width - 100) + boundary.x;
    const randomTop = Math.random() * (boundary.height - 100) + boundary.y;

    const text = new fabric.Textbox("Editable Text", {
      fontFamily: "Bungee Inline",
      left: randomLeft,
      top: randomTop,
      // width: 150,
      fontSize: 20,
      id: `text-${Date.now()}`,
    });
    canvas.add(text);
    setSelectedShape(text);

    setActionStack((prevStack) => [
      ...prevStack,
      { type: "add", object: text },
    ]);
  };

  const deleteShape = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      setActionStack((prevStack) => [
        ...prevStack,
        {
          type: "delete",
          object: activeObject,
        },
      ]);

      canvas.remove(activeObject);
      canvas.discardActiveObject(); // Deselect after deletion
      console.log("Selected object deleted");
    } else {
      console.log("No shape selected for deletion");
    }
  };

  const rotateSelectedObject = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      const currentAngle = activeObject.get("angle") || 0;

      setActionStack((prevStack) => [
        ...prevStack,
        {
          type: "rotate",
          object: activeObject,
          oldAngle: currentAngle,
        },
      ]);

      activeObject.set("angle", currentAngle + 90);
      activeObject.set("originX", "center");
      activeObject.set("originY", "center");

      activeObject.setCoords();

      canvas.requestRenderAll();
      console.log("Selected object rotated by 90 degrees");
    } else {
      console.log("No shape selected for rotation");
    }
  };

  const undo = () => {
    if (actionStack.length === 0) return;

    const lastAction = actionStack[actionStack.length - 1];

    switch (lastAction.type) {
      case "add":
        canvas.remove(lastAction.object);
        break;

      case "delete":
        canvas.add(lastAction.object);
        break;

      case "rotate":
        const { object: rotatedObject, oldAngle } = lastAction;
        rotatedObject.set("angle", oldAngle);
        rotatedObject.setCoords(); // Update the position and control points
        canvas.renderAll();
        break;

      default:
        break;
    }

    setActionStack((prevStack) => prevStack.slice(0, -1));
  };

  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    if (!canvas) return;

    const newZoomLevel = Math.min(zoomLevel * 1.1, 3); // Limit max zoom
    const center = canvas.getCenter();
    canvas.zoomToPoint({ x: center.left, y: center.top }, newZoomLevel);
    setZoomLevel(newZoomLevel);
  };

  const handleZoomOut = () => {
    if (!canvas) return;

    const newZoomLevel = Math.max(zoomLevel * 0.9, 0.5);
    const center = canvas.getCenter();
    canvas.zoomToPoint({ x: center.left, y: center.top }, newZoomLevel);
    setZoomLevel(newZoomLevel);
  };

  const resetZoom = () => {
    if (!canvas) return;

    canvas.setZoom(1);
    canvas.absolutePan({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  useEffect(() => {
    if (!canvas) return;

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    canvas.on("mouse:down", (event) => {
      if (event.e.shiftKey) {
        isDragging = true;
        const { clientX, clientY } = event.e;
        lastPosX = clientX;
        lastPosY = clientY;
        canvas.setCursor("grab");
        canvas.renderAll();
      }
    });

    canvas.on("mouse:move", (event) => {
      if (isDragging) {
        const { clientX, clientY } = event.e;
        const deltaX = clientX - lastPosX;
        const deltaY = clientY - lastPosY;
        canvas.relativePan(new fabric.Point(deltaX, deltaY));
        lastPosX = clientX;
        lastPosY = clientY;
      }
    });

    canvas.on("mouse:up", () => {
      isDragging = false;
      canvas.setCursor("default");
      canvas.renderAll();
    });

    return () => {
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    };
  }, [canvas]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return; // No object selected, do nothing

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        event.preventDefault();
      }

      const nudgeAmount = 0.5;
      const resizeStep = 0.005;

      if (!e.shiftKey) {
        switch (e.key) {
          case "ArrowUp":
            activeObject.set("top", activeObject.top - nudgeAmount);
            break;
          case "ArrowDown":
            activeObject.set("top", activeObject.top + nudgeAmount);
            break;
          case "ArrowLeft":
            activeObject.set("left", activeObject.left - nudgeAmount);
            break;
          case "ArrowRight":
            activeObject.set("left", activeObject.left + nudgeAmount);
            break;
          default:
            return;
        }
      } else {
        switch (e.key) {
          case "ArrowUp":
            activeObject.set("scaleY", activeObject.scaleY + resizeStep);
            break;
          case "ArrowDown":
            activeObject.set(
              "scaleY",
              Math.max(0.1, activeObject.scaleY - resizeStep)
            );
            break;
          case "ArrowLeft":
            activeObject.set(
              "scaleX",
              Math.max(0.1, activeObject.scaleX - resizeStep)
            );
            break;
          case "ArrowRight":
            activeObject.set("scaleX", activeObject.scaleX + resizeStep);
            break;
          default:
            return;
        }
      }

      activeObject.setCoords();
      canvas.renderAll();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    const handleMouseWheel = (opt) => {
      // Check if the Shift key is pressed
      if (!opt.e.shiftKey) return;

      const delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta; // Smooth zooming
      zoom = Math.max(0.5, Math.min(zoom, 10)); // Set zoom limits (min 0.5x, max 10x)

      // Get pointer position and zoom relative to that
      const pointer = canvas.getPointer(opt.e);
      const point = new fabric.Point(pointer.x, pointer.y);

      canvas.zoomToPoint(point, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    canvas.on("mouse:wheel", handleMouseWheel);

    return () => {
      canvas.off("mouse:wheel", handleMouseWheel);
    };
  }, [canvas]);

  const exportCanvasAsPDF = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      multiplier: 2,
    });

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(dataURL, "PNG", 0, 0, canvas.width, canvas.height);

    pdf.save("canvas-design.pdf");
  };

  const handleObjectSelection = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      const type = activeObject.type || "Unknown";
      const customType = activeObject.customType || "Not specified";
      const width = Math.round(activeObject.width * activeObject.scaleX); // Adjusted for scaling
      const height = Math.round(activeObject.height * activeObject.scaleY); // Adjusted for scaling

      setSelectedObjectDetails({
        type: type === "image" ? "Image" : type, // Fabric type
        customType, // Our custom type
        width,
        height,
      });
    } else {
      setSelectedObjectDetails(null); // No object selected
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const updateSelection = () => handleObjectSelection();

    canvas.on("selection:created", updateSelection);
    canvas.on("selection:updated", updateSelection);
    canvas.on("selection:cleared", () => setSelectedObjectDetails(null)); // Clear details on deselection

    return () => {
      canvas.off("selection:created", updateSelection);
      canvas.off("selection:updated", updateSelection);
      canvas.off("selection:cleared");
    };
  }, [canvas]);

  const [estimatedCosts, setEstimatedCosts] = useState({
    totalCost: null,
    greyStructureCost: null,
    laborCost: null,
    productsCost: null,
  });

  // Modify your estimateCosts function
  const estimateCosts = () => {
    if (!canvas) return;

    const ratePerSqFt = 1588;
    const allObjects = canvas.getObjects();
    let totalCost = 0;
    let greyStructureCost = area * ratePerSqFt;
    let productsCost = 0;
    let productDetails = []; // Stores individual product costs

    allObjects.forEach((obj) => {
      if (obj.customType) {
        let itemCost = 0;

        if (obj.customType === "Wall") {
          // Wall costs added to grey structure
          const width = obj.scaleX * obj.width;
          const height = obj.scaleY * obj.height;
          const area = width * height;
          itemCost = area * obj.baseCostPerPixel;
          greyStructureCost += itemCost;
        } else {
          // Other objects added to product cost
          itemCost = obj.cost || 0;
          productsCost += itemCost;

          // Store product details
          productDetails.push({
            name: obj.customType || "Unknown Product",
            value: itemCost,
          });
        }
      }
    });

    totalCost += productsCost;

    // Labor cost is 10% of grey structure cost
    const laborCost = greyStructureCost * 0.1;
    totalCost += greyStructureCost + laborCost;

    setEstimatedCosts({
      totalCost,
      greyStructureCost,
      laborCost,
      productsCost,
      productDetails, // Include product details for breakdown
    });
  };

  const costData = [
    { name: "Grey Structure", value: estimatedCosts.greyStructureCost },
    { name: "Labor Cost", value: estimatedCosts.laborCost },
    { name: "Products Cost", value: estimatedCosts.productsCost },
  ];

  const toggleBoundaryVisibility = () => {
    if (!canvas || !canvas.boundaryRect) return;

    const boundaryRect = canvas.boundaryRect;
    // const isCurrentlyVisible = boundaryRect.visible;
    const newVisibility = !boundaryRect.visible;

    boundaryRect.set("visible", newVisibility); // Toggle visibility
    canvas.renderAll(); // Re-render the canvas
    setIsBoundaryVisible(newVisibility); // Update state
  };

  const handleEstimateCosts = () => {
    const parsedArea = parseFloat(area);
    if (!isNaN(parsedArea) && parsedArea > 0) {
      estimateCosts(parsedArea);
    } else {
      alert("Please enter a valid area in square feet.");
    }
  };

  // const saveDesign = async (designName, canvasJson) => {
  //   try {
  //     // Retrieve JWT token from localStorage (or wherever you are storing it after login)
  //     const yourJWTToken = localStorage.getItem("jwtToken"); // Adjust if using sessionStorage or cookies

  //     if (!yourJWTToken) {
  //       console.error("User is not authenticated. Token is missing.");
  //       alert("Please log in to save your design.");
  //       return;
  //     }

  //     // Make the API call to save the design
  //     const response = await fetch("/api/design/save", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${yourJWTToken}`,
  //       },
  //       body: JSON.stringify({
  //         designName,
  //         canvasData: canvasJson,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert("Design saved successfully!");
  //       console.log("Server Response:", data);
  //     } else {
  //       console.error("Error saving design:", data.message);
  //       alert(`Error saving design: ${data.message}`);
  //     }
  //   } catch (error) {
  //     console.error("Error saving design:", error.message);
  //     alert("An unexpected error occurred while saving the design.");
  //   }
  // };

  //   const saveDesign = async () => {
  //     const canvasJSON = canvas.toJSON(); // Get Fabric.js JSON data

  //     const response = await fetch('http://localhost:3000/api/designs', { // Adjust port if needed
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ name: 'My Floor Plan', data: canvasJSON })
  //   });

  //     const result = await response.json();
  //     console.log(result);
  // };
  const { userData } = useAuth();
  const { token, logout } = useAuth(); // Get token from context

  const handleSaveConfirm = async () => {
    // Validate design name before sending
    if (!designName.trim()) {
      alert("Please enter a design name");
      return;
    }

    try {
      const canvasJSON = canvas.toJSON();

      // Add user email to payload
      const payload = {
        name: designName.trim(),
        data: canvasJSON,
        user: userData.email, // From your AuthContext
      };

      console.log("Saving payload:", payload);

      const response = await fetch("https://gharbanao-87pi.onrender.com/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Show server error message if available
        throw new Error(result.message || "Save failed");
      }

      console.log("Saved successfully:", result);

      // Update UI
      setShowNameModal(false);
      setDesignName("");

      // Refresh designs list
      const designsResponse = await fetch("https://gharbanao-87pi.onrender.com/api/designs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedDesigns = await designsResponse.json();
      setDesigns(updatedDesigns);
    } catch (error) {
      console.error("Save failed:", {
        error: error.message,
        stack: error.stack,
      });

      // Show detailed error message
      alert(`Save failed: ${error.message}`);

      // Auto-logout on 401 Unauthorized
      if (error.message.includes("Unauthorized")) {
        logout();
        navigate("/login");
      }
    }
  };

  const loadDesign = async (designId) => {
    try {
      const response = await fetch(
        `https://gharbanao-87pi.onrender.com/api/designs/${designId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const designData = await response.json();

      // Clear existing canvas content
      canvas.clear();

      // Load the design data
      canvas.loadFromJSON(designData.data, () => {
        canvas.renderAll();
        // Optional: Reset zoom/pan if you have those features
        canvas.setZoom(1);
        canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
      });
    } catch (error) {
      console.error("Error loading design:", error);
    }
  };

  // State for storing list of designs
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState("");
  // const navigate = useNavigate();

  // Fetch all designs on component mount
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        // 1. Check if token exists
        if (!token) {
          console.log("No token available");
          return;
        }

        // 2. Make the request
        const response = await fetch("https://gharbanao-87pi.onrender.com/api/designs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // // 3. Handle 401 Unauthorized
        // if (response.status === 401) {
        //   logout();
        //   navigate('/login');
        //   return;
        // }

        // 4. Handle other errors
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 5. Parse response
        const data = await response.json();

        // 6. Ensure we always set an array
        setDesigns(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch error:", error);
        setDesigns([]); // Fallback to empty array
      }
    };

    fetchDesigns();
  }, [token, logout]); // ✅ Add token as dependency

  const [designName, setDesignName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);

  const deleteDesign = async (designId) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;

    try {
      const response = await fetch(
        `https://gharbanao-87pi.onrender.com/api/designs/${designId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Response from delete API:", data);

      if (!response.ok) {
        throw new Error("Failed to delete design");
      }

      // Refresh designs list
      const updatedDesigns = designs.filter(
        (design) => design._id !== designId
      );
      setDesigns(updatedDesigns);

      alert("Design deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Delete failed: ${error.message}`);
    }
  };

  // Reusable Components Used in the Main Return

  const SidebarButton = ({ label, onClick, children }) => (
    <button
      onClick={onClick}
      className="w-full p-3 bg-[#d4e6e4] hover:bg-white text-black rounded-xl transition-all duration-200 flex items-center justify-center text-center font-medium"
    >
      {label}
    </button>
  );

  const DropdownButton = ({ label, isOpen, onToggle, children }) => (
    <div className="w-full relative flex justify-center">
      <button
        onClick={onToggle}
        className="w-full p-3 bg-[#d4e6e4] hover:bg-white text-gray-800 rounded-xl flex justify-center gap-7 items-center font-medium"
      >
        {label}
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          →
        </span>
      </button>
      {isOpen && (
        <div className="sm:absolute sm:left-full top-8 sm:top-0 ml-2 w-48 bg-white rounded-lg shadow-xl z-10">
          {children}
        </div>
      )}
    </div>
  );

  const DropdownItem = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
    >
      {children}
    </button>
  );

  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  const ActionButton = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="w-full p-3 bg-[#deedea] hover:bg-white rounded-lg flex flex-col items-center text-black transition-colors"
    >
      <img src={icon} className="w-6 h-6 mb-2" alt={label} />
      <span className="text-sm">{label}</span>
    </button>
  );

  const DesignManagementSection = ({
    designs,
    selectedDesign,
    setSelectedDesign,
    loadDesign,
    deleteDesign,
    setShowNameModal,
  }) => (
    <div className="pt-4 border-t border-gray-600 space-y-4">
      {designs.length > 0 ? (
        <div className="space-y-4 border-b-[0.5px]  pb-7">
          <select
            value={selectedDesign}
            onChange={(e) => setSelectedDesign(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
          >
            <option value="">Select Design</option>
            {designs.map((design) => (
              <option key={design._id} value={design._id}>
                {design.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => loadDesign(selectedDesign)}
              disabled={!selectedDesign}
              className="py-2 px-4 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
            >
              Load
            </button>
            <button
              onClick={() => deleteDesign(selectedDesign)}
              disabled={!selectedDesign}
              className="py-2 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center">No saved designs</p>
      )}
      <button
        onClick={() => setShowNameModal(true)}
        className="w-full py-2 bg-[#468378] hover:bg-[#4b9d8e] text-white rounded-lg transition-colors mt-7"
      >
        Save Design
      </button>
    </div>
  );

  const SaveDesignModal = ({
    show,
    designName,
    setDesignName,
    onSave,
    onCancel,
  }) => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (show && inputRef.current) {
        inputRef.current.focus(); // Auto-focus the input when modal appears
      }
    }, [show]);

    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
          <h3 className="text-xl font-bold">Save Design</h3>

          {/* Keep reference to input field */}
          <input
            ref={inputRef} // Attach reference
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            placeholder="Enter design name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:[#468378]"
          />

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!designName.trim()}
              className="px-4 py-2 bg-[#468378] hover:bg-[#4b9d8e] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add this new component inside your Design component
  const CostDisplayModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl">
        <h2 className="text-4xl font-bold mb-8 text-center">Cost Estimation</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[#D4E0E0] p-6 rounded-xl">
              <h3 className="text-2xl font-semibold mb-4">
                Total Estimated Cost
              </h3>
              <p className="text-3xl font-bold">
                PKR {estimatedCosts.totalCost.toLocaleString()}
              </p>
            </div>

            <div className="bg-[#FFDEDE] p-6 rounded-xl">
              <div className="flex items-start mb-4">
                <img
                  src={alertIcon}
                  alt="alert"
                  className="w-6 h-6 mt-1 mr-3"
                />
                <p className="text-lg">
                  Note: Prices may vary by up to 5% due to market fluctuations
                </p>
              </div>
              <div className="text-xl font-medium">
                PKR {(estimatedCosts.totalCost * 0.95).toLocaleString()} -{" "}
                {(estimatedCosts.totalCost * 1.05).toLocaleString()}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-4 h-4 bg-[#468378] mr-2 rounded-sm"></span>
                  Grey Structure
                </span>
                <span>
                  PKR {estimatedCosts.greyStructureCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-4 h-4 bg-[#2C3433] mr-2 rounded-sm"></span>
                  Finishing
                </span>
                <span>PKR {estimatedCosts.finishingCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Grey Structure",
                      value: estimatedCosts.greyStructureCost,
                    },
                    { name: "Finishing", value: estimatedCosts.finishingCost },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[COLORS[0], COLORS[1]].map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <button
          onClick={() => setShowCostModal(false)}
          className="mt-6 w-full py-3 bg-[#468378] text-white rounded-xl font-semibold hover:bg-[#36695e] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1920px] px-4 lg:px-8 xl:px-16 py-8 mx-auto">
        {/* Left Sidebar */}
        {/* Left Sidebar */}
        <div className="w-full sm:w-96 xl:w-96 bg-[#2C3433] rounded-2xl p-6 space-y-8">
          {/* 🏗️ Items Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Wall Button */}
              <SidebarButton label="Wall" onClick={addWall} />

              {/* Door Dropdown */}
              <div className="flex justify-center">
                <DropdownButton
                  label="Door"
                  isOpen={isDoorDropdownOpen}
                  onToggle={toggleDoorDropdown}
                >
                  <DropdownItem onClick={addDoor}>Single Door</DropdownItem>
                  <DropdownItem onClick={addDoubleDoor}>
                    Double Door
                  </DropdownItem>
                </DropdownButton>
              </div>

              {/* Window Button */}
              <SidebarButton label="Window" onClick={addWindow} />

              {/* Furniture Dropdown */}
              <div className="relative">
                <DropdownButton
                  label="Furniture"
                  isOpen={isFurnitureDropdownOpen}
                  onToggle={toggleFurnitureDropdown}
                >
                  <DropdownItem onClick={addBed}>Bed</DropdownItem>
                  <DropdownItem onClick={addChair}>Chair</DropdownItem>
                  <DropdownItem onClick={addCouch}>Couch</DropdownItem>
                  <DropdownItem onClick={addTable}>Table</DropdownItem>
                  <DropdownItem onClick={addDinnerTable}>
                    Dinner Table
                  </DropdownItem>
                </DropdownButton>
              </div>

              {/* Other Items */}
              {[
                { label: "Stairs", action: addStairs },
                { label: "Car", action: addCar },
                { label: "Toilet", action: addToilet },
                { label: "Sink", action: addSink },
                { label: "Stove", action: addStove },
                { label: "Bath Tub", action: addBathtub },
                { label: "Text", action: addText },
              ].map((item) => (
                <SidebarButton
                  key={item.label}
                  label={item.label}
                  onClick={item.action}
                />
              ))}
            </div>
          </div>

          {/* 💰 Cost Estimation Section */}
          <div className="space-y-4 rounded-lg px-4 py-6  border-gray-500 bg-[#384e50]">
            <h3 className="text-lg font-semibold text-white">
              Cost Estimation
            </h3>

            {/* Area Input */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Area (sq ft)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g., 500"
                className="w-full px-3 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Estimate Button */}
            <button
              onClick={handleEstimateCosts}
              className="w-full py-2 bg-[#468378] hover:bg-[#4b9d8e] text-white rounded-lg transition-colors"
            >
              Estimate Costs
            </button>
          </div>

          {/* 🗂️ Save/Load Section */}
          <div className="space-y-6 pt-4 border-gray-500">
            {/* Design List & Controls */}
            <DesignManagementSection
              designs={designs}
              selectedDesign={selectedDesign}
              setSelectedDesign={setSelectedDesign}
              loadDesign={loadDesign}
              deleteDesign={deleteDesign}
              setShowNameModal={setShowNameModal}
            />

            {/* Save Design Modal */}
            <SaveDesignModal
              show={showNameModal}
              designName={designName}
              setDesignName={setDesignName}
              onSave={handleSaveConfirm}
              onCancel={() => setShowNameModal(false)}
            />
            {/* Selected Object Details */}
            {selectedObjectDetails && (
              <div className="p-4 bg-[#384e50] rounded-lg text-white space-y-2">
                <h3 className="font-bold text-lg border-b pb-2">
                  Object Details
                </h3>
                <DetailItem
                  label="Type"
                  value={selectedObjectDetails.customType}
                />
                <DetailItem
                  label="Width"
                  value={`${selectedObjectDetails.width}px`}
                />
                <DetailItem
                  label="Height"
                  value={`${selectedObjectDetails.height}px`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div
          className="flex-1 bg-[#dfe8e6] rounded-2xl p-4 lg:p-8"
          ref={divRef}
        >
          {/* <p>Inner div width: {divWidth}px</p>
          <p>Boundary width: {boundary.width}px</p> */}
          {/* In your JSX for the canvas container */}
          <div
            className="relative flex justify-center"
            style={{
              width: "100%",
              height: `${boundary.height}px`,
              // minHeight: "700px",
            }}
          >
            <canvas
              ref={canvasRef}
              className="z-10 w-full h-full rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-32 xl:w-40 bg-[#2C3433] rounded-2xl p-4 space-y-4 lg:flex lg:flex-col lg:justify-center">
          <ActionButton
            icon={deleteIcon}
            label="Delete"
            onClick={deleteShape}
          />
          <ActionButton
            icon={rotateIcon}
            label="Rotate"
            onClick={rotateSelectedObject}
          />
          <ActionButton icon={undoIcon} label="Undo" onClick={undo} />
          <ActionButton
            icon={zoomInIcon}
            label="Zoom In"
            onClick={handleZoomIn}
          />
          <ActionButton
            icon={zoomOutIcon}
            label="Zoom Out"
            onClick={handleZoomOut}
          />
          <ActionButton
            icon={resetZoomIcon}
            label="Reset Zoom"
            onClick={resetZoom}
          />
          <ActionButton
            icon={exportIcon}
            label="Export PDF"
            onClick={exportCanvasAsPDF}
          />
          <button
            onClick={toggleBoundaryVisibility}
            className="w-full p-3 bg-[#deedea] hover:bg-white text-black rounded-lg transition-colors"
          >
            {isBoundaryVisible ? "Hide Boundary" : "Show Boundary"}
          </button>
        </div>
      </div>
      {estimatedCosts.totalCost && (
        <div className="max-w-[1920px] m-auto">
          <div className="mt-20 bg-gray-100 mb-9 md:mx-44 p-10 pt-12 rounded-2xl shadow-md text-center ">
            <h2 className="text-5xl font-bold mb-14">Estimated Costs</h2>
            {/* Total Cost */}
            <h3 className="text-3xl font-semibold bg-[#D4E0E0] px-8 py-5 rounded-xl mt-4 inline">
              Total Cost: PKR {estimatedCosts.totalCost.toLocaleString()}
            </h3>
            {/* Cost Breakdown */}
            <div className="mt-14 flex justify-center gap-40">
              {/* Grey Structure Cost */}
              <div className="flex">
                <div className="bg-[#468378] w-3 rounded-xl mr-4"></div>
                <div>
                  <h4 className="text-2xl text-gray-700">
                    Grey Structure Cost
                  </h4>
                  <p className="text-2xl">
                    PKR {estimatedCosts.greyStructureCost?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Labor Cost */}
              <div className="flex">
                <div className="bg-[#A8B0AF] w-3 rounded-xl mr-4"></div>
                <div>
                  <h4 className="text-2xl text-gray-700">Labor Cost</h4>
                  <p className="text-2xl">
                    PKR {estimatedCosts.laborCost?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Products Cost */}
              <div className="flex">
                <div className="bg-[#2C3433] w-3 rounded-xl mr-4"></div>
                <div>
                  <h4 className="text-2xl text-gray-700">Products Cost</h4>
                  <p className="text-2xl">
                    PKR {estimatedCosts.productsCost?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={300} className="mt-10">
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={125}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Summary Section */}
            <div className="mt-16 bg-white p-6 rounded-xl shadow-md text-left ">
              <h3 className="text-3xl font-semibold mb-6">Cost Summary</h3>

              <div className="flex justify-between py-2 border-b">
                <span className="text-lg">Grey Structure Cost</span>
                <span className="text-lg font-semibold">
                  PKR {estimatedCosts.greyStructureCost.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-lg">Labor Cost</span>
                <span className="text-lg font-semibold">
                  PKR {estimatedCosts.laborCost.toLocaleString()}
                </span>
              </div>

              {/* Toggle Button */}
              <div
                className="flex justify-between py-2 border-b cursor-pointer"
                onClick={() => setShowProductDetails(!showProductDetails)}
              >
                <span className="text-lg ">Products Cost</span>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">
                    PKR {estimatedCosts.productsCost.toLocaleString()}
                  </span>
                  <span className="ml-3 text-5xl">
                    {showProductDetails ? "↑" : "↓"}
                  </span>
                </div>
              </div>

              {/* Display Individual Product Costs - Expandable */}
              {showProductDetails &&
                estimatedCosts.productDetails?.length > 0 && (
                  <div className="mt-4 transition-all duration-300">
                    <h4 className="text-2xl font-semibold mb-3">
                      Product Breakdown:
                    </h4>
                    {estimatedCosts.productDetails.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b"
                      >
                        <span className="text-lg">{product.name}</span>
                        <span className="text-lg font-semibold">
                          PKR {product.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Design;
