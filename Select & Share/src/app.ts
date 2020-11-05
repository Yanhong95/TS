import axios from "axios";

// 获取提交表单和用户输入的数据.
const form = document.querySelector("form")!;
// 只有下面指明了是HTMLInputElement, 下面获取value的时候才不会报错, 只有这个类型才有value.
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyBeZYL0Ce_nPpQ0vRVh3wrp9XD5oBRhQ-0";

// declare var google: any;

// 定义返回值的type
type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
  axios.get<GoogleGeocodingResponse>(
      //不是所有的字符都能放入urI, 用encodeURI(enteredAddress)能将字符转换成URI能用的格式
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`
    )
    .then(response => {
      console.log(response);
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location!");
      }
      // 获取geometry.location.
      const coordinates = response.data.results[0].geometry.location;
      // render map基于id.
      const map = new google.maps.Map(document.getElementById("map")!, {
        center: coordinates,
        zoom: 16
      }); 
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch(err => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
