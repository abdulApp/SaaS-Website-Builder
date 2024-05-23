import Sidebar from "@/components/sidebar";
import React from "react";

const Page = () => {
  return (
    <div className="h-screen overflow-hidden">
      hi
      <Sidebar id={"params.agencyId"} type="agency" />
      <div className="md:pl-[300px]">
        hello
        {/* <InfoBar notifications={allNoti} role={allNoti.User?.role} /> */}
        <div className="relative">{/* <BlurPage>{children}</BlurPage> */}</div>
      </div>
    </div>
  );
};

export default Page;
