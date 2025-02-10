import React, { useState } from "react";
import Navigation from "./Navigation";
import herosecImage from "../assets/herosec-image.png";
import alertIcon from "../assets/alertIcon.svg";
import "./HomePage.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CostEstimation = () => {
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("Sq. ft");
  const [coveredAreaUnit, setCoveredAreaUnit] = useState("Sq. ft");
  const [coveredArea, setCoveredArea] = useState("");
  const [houseType, setHouseType] = useState("");
  const [constructionType, setConstructionType] = useState("");
  const [estimatedCosts, setEstimatedCosts] = useState({
    totalCost: null,
    greyStructureCost: null,
    finishingCost: null,
    laborCost: null,
  });

  const COLORS = ["#468378", "#2C3433", "#A8B0AF"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location || !area || !coveredArea || !houseType || !constructionType) {
      alert("Please fill in all required fields.");
      return;
    }
    // setLocation("");
    // setArea("");
    // setCoveredArea("");
    // setHouseType("");
    // setConstructionType("");
    let costPerSqFt =
      constructionType === "Economy"
        ? 3150
        : constructionType === "Standard"
        ? 3940
        : constructionType === "Premium"
        ? 5350
        : 0;

    let convertedArea = area;
    if (areaUnit === "Marla") {
      convertedArea *= 272;
    } else if (areaUnit === "Kanal") {
      convertedArea *= 5440;
    }
    let convertedCoveredArea = coveredArea;
    if (coveredAreaUnit === "Marla") {
      convertedCoveredArea *= 272;
    } else if (coveredAreaUnit === "Kanal") {
      convertedCoveredArea *= 5440;
    }

    const totalBaseCost = convertedCoveredArea * costPerSqFt;

    let greyStructureRatio;
    let finishingRatio;

    if (constructionType === "Economy") {
      greyStructureRatio = 0.66;
      finishingRatio = 0.34;
    } else if (constructionType === "Standard") {
      greyStructureRatio = 0.58;
      finishingRatio = 0.42;
    } else if (constructionType === "Premium") {
      greyStructureRatio = 0.52;
      finishingRatio = 0.48;
    } else {
      greyStructureRatio = 0;
      finishingRatio = 0;
    }

    let greyStructureCost = totalBaseCost * greyStructureRatio;
    let finishingCost =
      houseType === "Finished House" ? totalBaseCost * finishingRatio : 0;
    let laborCost =
      convertedCoveredArea * (houseType === "Grey Structure" ? 310 : 535);

    let totalCost =
      houseType === "Grey Structure"
        ? greyStructureCost + laborCost
        : greyStructureCost + finishingCost + laborCost;

    const locationMultiplier =
      location === "Lahore" ? 0.96 : location === "Karachi" ? 0.93 : 1;

    greyStructureCost = Math.round(greyStructureCost * locationMultiplier);
    finishingCost = Math.round(finishingCost * locationMultiplier);
    laborCost = Math.round(laborCost * locationMultiplier);
    totalCost = Math.round(totalCost * locationMultiplier);

    setEstimatedCosts({
      totalCost,
      greyStructureCost,
      finishingCost,
      laborCost,
    });
  };

  const costData = [
    { name: "Grey Structure", value: estimatedCosts.greyStructureCost },
    { name: "Finishing", value: estimatedCosts.finishingCost },
    { name: "Labor", value: estimatedCosts.laborCost },
  ];

  return (
    <div>
      <Navigation />
      <div className="cost-section max-w-[1920px] m-auto py-7 px-16 mt-16">
        <div className="cost-container">
          <h1 className="text-7xl font-semibold">
            Calculate Cost of your House
          </h1>
          <div className="form-section flex mt-8 items-center">
            <div className="form w-3/5">
              <form onSubmit={handleSubmit}>
                {/* Form Fields */}
                <div className="flex flex-col">
                  <label className="text-xl ml-3 mb-2 font-medium">
                    Location
                  </label>
                  <select
                    className="bg-[#46837818] w-3/5 px-7 py-5 text-xl rounded-2xl outline-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select Location</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                  </select>
                </div>
                {/* Construction Type */}
                <div className="flex flex-col mt-7">
                  <label className="text-xl ml-3 mb-2 font-medium">
                    Construction Type
                  </label>
                  <select
                    className="bg-[#46837818] w-3/5 px-7 py-5 text-xl rounded-2xl outline-none"
                    value={constructionType}
                    onChange={(e) => setConstructionType(e.target.value)}
                  >
                    <option value="">Select Construction Type</option>
                    <option value="Economy">Economy</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                {/* Area and Area Unit */}
                <div className="flex flex-col mt-7 w-3/5">
                  <label className="text-xl ml-3 mb-2 font-medium">Area</label>
                  <div className="flex gap-3">
                    <input
                      className="bg-[#46837818] w-full px-7 py-5 text-xl rounded-2xl outline-none"
                      type="number"
                      step="0.01"
                      placeholder="Enter total Area"
                      min="0"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                    <select
                      className="bg-[#46837818] px-5 py-5 text-xl rounded-2xl outline-none"
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value)}
                    >
                      <option value="Sq. ft">Sq. ft</option>
                      <option value="Marla">Marla</option>
                      <option value="Kanal">Kanal</option>
                    </select>
                  </div>
                </div>
                {/* Covered Area */}
                <div className="flex flex-col mt-7 w-3/5">
                  <label className="text-xl ml-3 mb-2 font-medium">
                    Covered Area
                  </label>
                  <div className="flex gap-3">
                    <input
                      className="bg-[#46837818] w-full px-7 py-5 text-xl rounded-2xl outline-none"
                      type="number"
                      step="0.01"
                      placeholder="Enter Covered Area in Sq. ft"
                      min="0"
                      value={coveredArea}
                      onChange={(e) => setCoveredArea(e.target.value)}
                    />
                    <select
                      className="bg-[#46837818] px-5 py-5 text-xl rounded-2xl outline-none"
                      value={coveredAreaUnit}
                      onChange={(e) => setCoveredAreaUnit(e.target.value)}
                    >
                      <option value="Sq. ft">Sq. ft</option>
                      <option value="Marla">Marla</option>
                      <option value="Kanal">Kanal</option>
                    </select>
                  </div>
                </div>
                {/* Type of House */}
                <div className="flex flex-col mt-7 items-start">
                  <label className="text-2xl ml-3 font-semibold mb-5">
                    Type of House
                  </label>
                  <div className="flex gap-20 ml-5">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="houseType"
                        value="Grey Structure"
                        checked={houseType === "Grey Structure"}
                        onChange={(e) => setHouseType(e.target.value)}
                      />
                      <label className="text-xl">Grey Structure</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="houseType"
                        value="Finished House"
                        checked={houseType === "Finished House"}
                        onChange={(e) => setHouseType(e.target.value)}
                      />
                      <label className="text-xl">Finished House</label>
                    </div>
                  </div>
                </div>
                {/* Submit Button */}
                <button className="text-xl bg-[#468378] text-white font-semibold px-10 py-4 rounded-2xl mt-12">
                  Calculate Estimated Cost
                </button>
              </form>
            </div>
            <div className="w-2/5">
              <img src={herosecImage} alt="House estimation" />
            </div>
          </div>
        </div>
        {/* Display Cost and Pie Chart */}
        {estimatedCosts.totalCost && (
          <div className="mt-20 mb-9 mx-44 p-10 pt-12 bg-gray-100 rounded-2xl shadow-md text-center">
            <h2 className="text-5xl font-bold mb-14 ">Estimated Costs</h2>
            <div className="flex flex-col justify-between items-center">
              <h3 className="text-3xl font-semibold bg-[#D4E0E0] px-8 py-5 rounded-xl mt-4 inline">
                Total Cost: PKR {estimatedCosts.totalCost.toLocaleString()}
              </h3>
              <div className="flex flex-col bg-[#FFDEDE] px-8 py-5 rounded-xl mt-7 items-center ">
                <div className="flex">
                  <img src={alertIcon} alt="" />
                  <h3 className="text-xl inline ml-6">
                    {/* Total Cost: PKR {estimatedCosts.totalCost.toLocaleString()} */}
                    Please note that due to fluctuations in current market
                    prices, there may be a{" "}
                    <span className="font-semibold text-2xl">5% </span> variance
                    in the estimated cost.
                  </h3>
                </div>
                <h2 className="text-2xl mt-4 font-medium">
                  PKR{" "}
                  {(estimatedCosts.totalCost * 0.95).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  - PKR{" "}
                  {(estimatedCosts.totalCost * 1.05).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </h2>
              </div>
            </div>
            <div className="mt-14 flex justify-center gap-40">
              <div className="flex">
                <div className="bg-[#468378] w-3 rounded-xl mr-4"></div>
                <div>
                  <h4 className="text-2xl text-gray-700">
                    Grey Structure Cost
                  </h4>
                  <p className="text-2xl">
                    PKR {estimatedCosts.greyStructureCost.toLocaleString()}
                  </p>
                </div>
              </div>
              {houseType === "Finished House" &&
                estimatedCosts.finishingCost > 0 && (
                  <div className="flex">
                    <div className="bg-[#2C3433] w-3 rounded-xl mr-4"></div>
                    <div>
                      <h4 className="text-2xl text-gray-700">Finishing Cost</h4>
                      <p className="text-2xl">
                        PKR {estimatedCosts.finishingCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              <div className="flex">
                <div className="bg-[#A8B0AF] w-3 rounded-xl mr-4"></div>
                <div>
                  <h4 className="text-2xl text-gray-700">Labor Cost</h4>
                  <p className="text-2xl">
                    PKR {estimatedCosts.laborCost.toLocaleString()}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CostEstimation;
