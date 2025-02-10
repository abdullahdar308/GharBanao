import React, { useState } from "react";
import { Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import layoutIcon from "../assets/layoutIcon.svg";
import costIcon from "../assets/costIcon.svg";
import shopIcon from "../assets/shopIcon.svg";
import blackArrowIcon from "../assets/arrowIcon.svg";
import whiteArrowIcon from "../assets/whiteArrowIcon.svg";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const [isLayoutHovered, setIsLayoutHovered] = useState(false);
  const [isCostHovered, setIsCostHovered] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const { userData, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleLayoutCardClick = () => {
    navigate("/design");
  };
  const handleCostCardClick = () => {
    navigate("/costEstimation");
  };
  const handleShopCardClick = () => {
    navigate("/catalogue");
  };

  const faqs = [
    {
      question: "How do I start designing my house layout?",
      answer:
        "Simply sign up for an account, then click on the Design tab to begin creating your layout using our intuitive tools.",
    },
    {
      question: "Is there a limit to the number of designs I can create?",
      answer:
        "No, you can create as many designs as you like with your account.",
    },
    {
      question: "Can I save my designs and come back to them later?",
      answer:
        "Yes, you can save your designs to your account and access them whenever you want to make changes or continue working on them.",
    },
    {
      question: "Can I access my designs from multiple devices?",
      answer:
        "Yes, you can access your designs from any device with an internet connection by logging into your account.",
    },
    {
      question: "How do I create an account on your website?",
      answer:
        "To create an account, simply click on the Sign Up or Register button and follow the prompts to enter your information.",
    },
    {
      question: "Do I need any special software to use your design tools?",
      answer:
        "No, our design tools are web-based and do not require any special software. You can access them directly through your web browser.",
    },
  ];
  const [activeIndex, setActiveIndex] = useState(null);
  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <div className="main-sec">
          <Navigation />

          <div className="hero-sec pb-24 px-16 max-w-[1920px] m-auto">
            <div className="left-side 2xl:w-[1000px] xl:w-[68%] w-full">
              <div className="main-line text-[23px] sm:text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px]">
                <p className="2xl:w-[700px] xl:w-[560px] lg:w-[490px] md:w-[420px] sm:w-[370px] w-[310px]">
                  <span>Design</span> Your Dream, <span>Estimate</span> Your
                  Costs, <span>Shop</span> Your Favourites - Effortlessly.
                </p>
              </div>
              <div className="second-line w-full text-[11px] sm:text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px]">
                <p className=" 2xl:w-[700px] xl:w-[560px] lg:w-[490px] md:w-[420px] sm:w-[370px] w-[85%]">
                  Experience the convenience of designing, budgeting, and
                  shopping for your dream home with our all-in-one platform
                  tailored to your needs.
                </p>
              </div>
              <button onClick={handleLayoutCardClick} className="design-btn">
                Design Now
              </button>
            </div>
            <div className="right-side sm:flex justify-center items-center m:w-[90%] md:w-[90%] lg:w-[80%] xl:w-[90%] 2xl:w-full hidden">
              <img className="herosec-img s" src="/herosec-image.png" alt="" />
            </div>
          </div>
          <div className="px-16 sm:px-32 mb-24 max-w-[1920px] m-auto">
            <h1 className="text-center text-7xl font-semibold text-[#2c3433] mb-24">
              Our Services
            </h1>
            <div className="flex md:flex-row flex-col gap-10  md:gap-0 justify-between items-stretch">
              <div
                onClick={handleLayoutCardClick}
                onMouseEnter={() => setIsLayoutHovered(true)}
                onMouseLeave={() => setIsLayoutHovered(false)}
                className="md:w-[30%] bg-[#EDF3F2] px-12 py-12 rounded-[30px] cursor-pointer hover:bg-[#2C3433] group transition-colors duration-300"
              >
                <div className="bg-white rounded-2xl p-5 inline-block transition-colors duration-300">
                  <img className="w-12" src={layoutIcon} alt="" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-3xl font-semibold mt-5 group-hover:text-white transition-colors duration-300">
                  House Layout Designing
                </h2>
                <p className="text-2xl md:text-xl w-4/5 text-[#444] mt-6 group-hover:text-white transition-colors duration-300">
                  Design your dream home effortlessly, spend more time bringing
                  it to life!
                </p>
                <div className="flex justify-end mt-11">
                  <img
                    className="transition-colors duration-300"
                    src={isLayoutHovered ? whiteArrowIcon : blackArrowIcon}
                    alt=""
                  />
                </div>
              </div>
              <div
                onClick={handleCostCardClick}
                onMouseEnter={() => setIsCostHovered(true)}
                onMouseLeave={() => setIsCostHovered(false)}
                className="md:w-[30%] bg-[#EDF3F2] px-12 py-12 rounded-[30px] cursor-pointer hover:bg-[#2C3433] group transition-colors duration-300"
              >
                <div className="bg-white rounded-2xl p-5 inline-block transition-colors duration-300">
                  <img className="w-12" src={costIcon} alt="" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-3xl font-semibold mt-5 group-hover:text-white transition-colors duration-300">
                  Cost Estimation
                </h2>
                <p className="text-2xl md:text-xl w-4/5 text-[#444] mt-6 group-hover:text-white transition-colors duration-300">
                  Estimate your project costs accurately, focus on building your
                  dream space!
                </p>
                <div className="flex justify-end mt-11">
                  <img
                    className="transition-colors duration-300"
                    src={isCostHovered ? whiteArrowIcon : blackArrowIcon}
                    alt=""
                  />
                </div>
              </div>
              <div
                onClick={handleShopCardClick}
                onMouseEnter={() => setIsShopHovered(true)}
                onMouseLeave={() => setIsShopHovered(false)}
                className="md:w-[30%] bg-[#EDF3F2] px-12 py-12 rounded-[30px] cursor-pointer hover:bg-[#2C3433] group transition-colors duration-300"
              >
                <div className="bg-white rounded-2xl p-5 inline-block transition-colors duration-300">
                  <img className="w-12" src={shopIcon} alt="" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-3xl font-semibold mt-5 group-hover:text-white transition-colors duration-300">
                  Real Time Catalogue
                </h2>
                <p className="text-2xl md:text-xl w-4/5 text-[#444] mt-6 group-hover:text-white transition-colors duration-300">
                  Shop for household items effortlessly, invest your time in
                  perfecting your dream space!
                </p>
                <div className="flex justify-end mt-11 ">
                  <img
                    className="transition-colors duration-300 md:text-full sm:text-[80%] text-[10%]"
                    src={isShopHovered ? whiteArrowIcon : blackArrowIcon}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-16 sm:px-32 mb-24 mt-12 max-w-[1920px] m-auto">
            <h1 className="text-center text-7xl font-semibold text-[#2c3433] mb-24 leading-[40px]">
              Frequently <br /> Asked Questions
            </h1>
            <div className="faq-accordion md:w-3/5 w-full m-auto">
              {faqs.map((faq, index) => (
                <div
                  className={`faq-item ${
                    activeIndex === index ? "active" : ""
                  }`}
                  key={index}
                >
                  <div
                    className="faq-header flex justify-between cursor-pointer items-center mt-7"
                    onClick={() => handleToggle(index)}
                  >
                    <h3 className="text-xl pr-3 sm:text-2xl font-medium">
                      {faq.question}
                    </h3>
                    <span className="text-4xl icon">
                      {activeIndex === index ? "-" : "+"}
                    </span>
                  </div>
                  <p className="text-xl mt-4 mb-7 faq-content fade-in">
                    {activeIndex === index ? faq.answer : ""}
                  </p>
                  <hr />
                </div>
              ))}
            </div>
          </div>

          <div className="px-16 lg:px-44 mt-12 CTO-bg ">
            <div className="max-w-[1920px] m-auto">
              <div className="bg-[#468378] rounded-[36px] p-32">
                <h1 className="text-white text-center text-5xl sm:text-6xl font-semibold sm:w-3/5 w-[90%] m-auto leading-[24px] sm:leading-[30px] md:leading-[37px] lg:leading-[42px] xl:leading-[52px]">
                  Step into the Driver's Seat of Your Dream Home Design Journey
                </h1>
                <h3 className="text-white text-center text-2xl sm:text-3xl m-auto mt-12">
                  Transform your vision into reality, design with clarity, and
                  elevate every corner.
                </h3>
                <div className="flex justify-center mt-16">
                  <button
                    onClick={handleLayoutCardClick}
                    className="bg-white text-3xl sm:text-2xl rounded-xl text-[#468378] font-medium px-8 py-4"
                  >
                    Design Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="px-24 md:px-44 bg-[#dae6e4] pt-32 ">
            <div className="max-w-[1920px] m-auto ">
              <div className="flex sm:flex-row flex-col pb-16">
                <div className="w-[45%] md:w-[60%]">
                  <img
                    className="logo md:w-[135px] sm:w-[100px] w-[100px]  lg:w-[200px]"
                    src="/logo.png"
                    alt=""
                  />
                  <p className="text-xl w-[300px] mt-10 text-[#454545]">
                    Design your dream home effortlessly and bring your vision to
                    life today
                  </p>
                </div>
                <div className="w-full sm:mt-0 mt-12 sm:w-[40%] ">
                  {/* <div className="w-full flex justify-end"> */}
                  <div className="flex sm:justify-between sm:gap-0 gap-8">
                    <h3
                      onClick={handleLayoutCardClick}
                      className="text-2xl cursor-pointer"
                    >
                      Design
                    </h3>
                    <h3
                      onClick={handleCostCardClick}
                      className="text-2xl cursor-pointer"
                    >
                      Cost Estimation
                    </h3>
                    <h3
                      onClick={handleShopCardClick}
                      className="text-2xl cursor-pointer"
                    >
                      Visit Catalogue
                    </h3>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
          <div className="bg-[#2C3433] flex justify-center py-5">
            <h3 className="text-white text-2xl flex">
              &copy; &nbsp;
              <img
                className="logo w-[65px] sm:w-[85px] md:w-[100px]"
                src="/logo2.svg"
                alt=""
              />
              &nbsp; All Rights Reserved.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
