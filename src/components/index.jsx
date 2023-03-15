// Samples
// https://cdn.dribbble.com/users/626186/screenshots/14448783/media/35a8662a4a25df2fd8b1838a799f1767.png?compress=1&resize=1600x1200&vertical=top
// https://danaberez.com/cute-instagram-stickers/
// https://www.socialmediaexaminer.com/how-to-use-instagram-countdown-sticker-business/
// https://www.businessinsider.com/guides/tech/how-to-do-countdown-on-instagram?r=US&IR=T
// https://contentmarketinginstitute.com/wp-content/uploads/2018/10/instagram-time-sticker.png
// https://images.ctfassets.net/az3stxsro5h5/3wxhTr4zrCufehMZn32vU3/e3b64c6d282e548af869578586d0d118/March30-How-to-Use-Instagrams-New-Scheduled-Sticker-on-Stories-Horizontal.png
// https://fashiontravelrepeat.com/wp-content/uploads/2020/04/Cute-Instagram-Story-Stickers-mikyla.jpg
// https://i0.wp.com/danaberez.com/wp-content/uploads/2021/01/cute-Instagram-Stickers-5.jpg?w=571&h=1173&ssl=1
// https://i0.wp.com/danaberez.com/wp-content/uploads/2021/01/cute-Instagram-Stickers-3.jpg?w=571&h=1173&ssl=1
// https://i0.wp.com/danaberez.com/wp-content/uploads/2021/01/cute-Instagram-Stickers-7.jpg?w=570&h=1174&ssl=1
// https://www.google.com/search?q=instagram+stories+sticker&tbm=isch&ved=2ahUKEwjb--Xpn9r9AhXvsScCHWHkAGMQ2-cCegQIABAA&oq=instagram+stories+sticker&gs_lcp=CgNpbWcQAzIFCAAQgAQyBQgAEIAEMgYIABAFEB4yBggAEAgQHjIGCAAQCBAeMgYIABAIEB4yBggAEAgQHjIECAAQHjIGCAAQCBAeMgYIABAIEB46BAgjECdQgA1Y1BRghRZoAHAAeACAAdUFiAHGEZIBCTMtMy4xLjAuMZgBAKABAaoBC2d3cy13aXotaW1nwAEB&sclient=img&ei=IMsPZNvrIe_jnsEP4ciDmAY&bih=865&biw=1512&rlz=1C5CHFA_enTZ1006TZ1006

// https://images.creativemarket.com/0.1.0/ps/7368621/600/400/m2/fpnw/wm0/07-premade-scene-.jpg?1574781882&s=0a7374b23778c367ff3345a09eeffaa3&fmt=webp
// https://images.creativemarket.com/0.1.0/ps/7368620/600/400/m2/fpnw/wm0/09-premade-scene-.jpg?1574770029&s=a572badf003ad1a9257c807046079c11&fmt=webp
// https://images.creativemarket.com/0.1.0/ps/7368478/600/400/m2/fpnw/wm0/02-premade-scene-.jpg?1574768876&s=3b0cf28d49d3b105f358bf4ddc5fff94&fmt=webp
// https://creativemarket.com/ruby-and-heart/4335436-Wall-Moodboard-Scene-Creator?u=sisapu&utm_source=Link&utm_medium=CM+Social+Share&utm_campaign=Product+Social+Share&utm_content=Wall+Moodboard+Scene+Creator&ts=202005
// https://pixelbuddha.net/mockups/martinika-moodboard-maker

import AddOnSdk from "https://preview.projectx.corp.adobe.com/static/add-on-sdk/sdk.js";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

AddOnSdk.ready.then(() => {
    console.log("AddOnSdk is ready for use.");
    window.AddOnSdk = AddOnSdk;

    const root = createRoot(document.getElementById("root"));
    root.render(<App addOnSdk={AddOnSdk} />);
});
