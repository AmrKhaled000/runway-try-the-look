const Look = require('./models/Look');
const BASE = 'https://reel-ref-try-the-look.vercel.app/assets/';

const looks = [
  { name:'The City Edit', modelImage: BASE+'model-1-640.webp', originalImage: BASE+'original-look-1.webp', description:'A charcoal knit and easy denim.', products:['tatum-5-orbit-copy','tshirt','sweatshirt'], pins:[{product:'Air Jordan 12 Retro',left:47,top:27},{product:'Tshirt',left:48,top:58},{product:'Sweatshirt',left:45,top:96}] },
  { name:'Gallery Opening', modelImage: BASE+'model-5-640.webp', originalImage: BASE+'original-look-5.webp', description:'A clean white tee and relaxed denim.', products:['tatum-5-orbit','hoodie-black','tshirt'], pins:[{product:'Tatum 5 Orbit',left:50,top:28},{product:'Hoodie Black',left:48,top:58},{product:'Tshirt',left:45,top:88}] },
  { name:'Gallery Opening', modelImage: BASE+'model-4-640.webp', originalImage: BASE+'original-look-4.webp', description:'Olive knitwear. A grounded palette.', products:['sweatshirt-plus','tatum-5-orbit','tshirt'], pins:[{product:'Sweatshirt Plus',left:50,top:28},{product:'Tatum 5 Orbit',left:48,top:58},{product:'Tshirt',left:45,top:88}] },
  { name:'Studio Day', modelImage: BASE+'model-6-640.webp', originalImage: BASE+'original-look-6.webp', description:'Black, white and laid-back denim.', products:['hoodie-black','tatum-5-orbit-copy','tshirt'], pins:[{product:'Hoodie Black',left:50,top:28},{product:'Air Jordan 12 Retro',left:48,top:58},{product:'Tshirt',left:45,top:88}] },
  { name:'Studio Day', modelImage: BASE+'model-3-640.webp', originalImage: BASE+'original-look-3.webp', description:'Burgundy layers. A tailored perspective.', products:['sweatshirt','tatum-5-orbit','tshirt'], pins:[{product:'Sweatshirt',left:50,top:28},{product:'Tatum 5 Orbit',left:48,top:58},{product:'Tshirt',left:45,top:88}] },
  { name:'Studio Day', modelImage: BASE+'model-2-640.webp', originalImage: BASE+'original-look-2.webp', description:'A grey crew and your favourite denim.', products:['hoodie','air-jordan-12-retro-copy','tshirt'], pins:[{product:'Hoodie',left:50,top:28},{product:'Luka 5',left:48,top:58},{product:'Tshirt',left:45,top:88}] }
];

async function seedLooks() {
  const count = await Look.countDocuments();
  if (count > 0) return;
  await Look.insertMany(looks);
  console.log('Seeded', looks.length, 'looks');
}

module.exports = { seedLooks, looks };