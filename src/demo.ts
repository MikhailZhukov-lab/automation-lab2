import { calcDeliveryFee } from "./delivery.ts";
import { calcParkingFee } from "./parking.ts";
console.log("Delivery (500 UAH, 6 kg):", calcDeliveryFee(500, 6));
console.log(
  "Express (500 UAH, 100 kg):",
  calcDeliveryFee(500, 100, { express: true }),
);
console.log(
  "Free express (1000 UAH, 100 kg):",
  calcDeliveryFee(1000, 100, { express: true }),
);
console.log(
  "Parking (600 min, night+weekend):",
  calcParkingFee(600, { night: true, weekend: true }),
);
