import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      {/* 
         TO USE YOUR OWN LOGO:
         1. Rename your logo image file to 'logo.png' (or jpg)
         2. Place it in the 'public' folder of your project.
         3. Change the src below to: src="./logo.png"
      */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-[6px] border-white shadow-2xl bg-white group transition-transform duration-300 hover:scale-105">
        <img 
          // Official La Confraternita Della Pizza Logo (Monk)
          // referrerPolicy="no-referrer" is required to load images from forumfree domains without 403 errors
          src="https://scontent-pmo1-1.xx.fbcdn.net/v/t39.30808-6/313404859_163627646298870_6187848417625883205_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=5JZ03a3SyKcQ7kNvwECHGt1&_nc_oc=AdnqUPMvAQUGrwdkc1RG7HtScd1QcN9XXR4RH2nRQinqSpl21qkj4rHluOofXKie0UE&_nc_zt=23&_nc_ht=scontent-pmo1-1.xx&_nc_gid=c3E579BASSxFpVy2V-WAGg&oh=00_AfmO_bdWmKFWnz1epjbL7pkAGXOfTvujIvpSpEIToDw-og&oe=6948B46F" 
          alt="La Confraternita Della Pizza Logo" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 rounded-full border border-black/5 pointer-events-none"></div>
      </div>
      <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-stone-800 font-serif text-center drop-shadow-sm tracking-tight">
        LABORATORIO PIZZA
      </h1>
      <div className="h-1 w-20 bg-amber-500 mt-3 rounded-full opacity-80"></div>
    </div>
  );
};
