import React from "react";
import { Card, CardContent } from "../ui/card";
import image from "../../assets/web-site.png";
import circle from "../../assets/circle.png";
import { NavLink } from "react-router-dom";

const ApplicationTile = ({ application }) => {
  return (
    <Card className="xl:h-[370px] xl:w-[350px] px-3 relative ">
      <span className="h-[8px] w-full bg-figmaPrimary absolute top-0 left-0 rounded-t-2xl"></span>
      <CardContent className="flex flex-col justify-end h-full ">
        <section className="relative h-[75px] w-[75px] mt-16 md:mt-8  md:mb-6">
          <img
            src={circle}
            alt="circle image"
            className="absolute -top-5 -left-4"
          />
          <img src={image} alt="web-site" />
        </section>
        <div className="space-y-2">
          <h2 className="font-[700] text-[20px] text-primary/90">
            {application.title}
          </h2>
          <p className="text-muted-foreground font-[500] text-[16px]">
            {application.post_description}
          </p>
          <NavLink
            to={`/myapplications/${application.id}`}
            className="text-figmaPrimary  font-semibold hover:underline underline-offset-2 decoration-figmaPrimary flex items-center gap-.5"
          >
            View Applications
          </NavLink>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTile;
