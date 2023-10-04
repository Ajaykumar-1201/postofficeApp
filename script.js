const id = document.getElementById("ip");

// Function to fetch the public IP address
async function getPublicIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    alert("Error fetching public IP address:", error);
    console.error("Error fetching public IP address:", error);
    return null;
  }
}

// Call the function to get the public IP address
getPublicIPAddress().then((ipAddress) => {
  if (ipAddress) {
    console.log("Public IP Address:", ipAddress);
    ip = ipAddress;
    id.innerText = `Your Current IP Address is ${ipAddress}`;
  } else {
    alert("Unable to fetch public IP address.");
  }
});

async function getUserDetails() {
  try {
    const response = await fetch(
      `https://ipinfo.io/${ip}?token=9b02eaea83291e`
    );
    data1 = await response.json();

    const response2 = await fetch(
      `https://api.postalpincode.in/pincode/${data1.postal}`
    );
    data2 = await response2.json();
    renderPage(data1, data2);
  } catch (error) {
    alert(error);
  }
}

const button = document.getElementById("btn");

function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  // Adjust hours for am/pm format
  const formattedHours = hours % 12 || 12;

  const dateFormatted = `${day}/${month}/${year}`;
  const timeFormatted = `${formattedHours}:${minutes} ${ampm}`;

  return { day: dateFormatted, time: timeFormatted };
}

function renderPage(userDetails, post) {
  const loc = userDetails.loc.split(",");
  const currentDate = new Date();
  const formattedDateTime = formatDateTime(currentDate);

  const body = document.body;
  body.innerHTML = "";
  body.innerHTML = `<div class="head">
    <p class="ip-address">IP Address : 1234</p>
    <div class="loc-info">
      <p class="a">Lat: ${loc[0]}</p>
      <p class="b">City: ${userDetails.city}</p>
      <p class="c">Organisation: ${userDetails.org}</p>
    </div>
    <div class="loc-info pad">
      <p class="a">Long: ${loc[1]}</p>
      <p class="b">Region: ${userDetails.region}</p>
      <p class="c">Hostname:</p>
    </div>
  </div>

  <div class="map">
    <p class="map-heading">Your Current Location</p>
    <iframe
      src="https://maps.google.com/maps?q=${userDetails.loc}&z=15&output=embed"
      frameborder="0"
      style="
        border: 0;
        width: 90vw;
        height: 65vh;
        margin-top: 3rem;
        border-radius: 1rem;
      "
    ></iframe>
  </div>

  <div class="more-info">
    <p class="mf-heading">More Information About You</p>
    <div class="info">
      <p>Time Zone: ${userDetails.timezone}</p>
      <p>Date And Time : ${formattedDateTime.day}  ${formattedDateTime.time}</p>
      <p>Pincode: ${userDetails.postal}</p>
      <p>Message: ${post[0].Message}</p>
    </div>
    <p class="mf-heading">Post Offices Near You</p>
    <div class="search-con">
      <img class="search" src="./assets/Vector.svg" />
      <input
        class="input-box"
        id="search-text"
        placeholder="Search By Name or Branch Office" type="text"
      />
    </div>
  </div>
  
  <div id="postOffice" class="card"></div>`;

  const searchElement = document.getElementsByClassName("input-box")[0];
  searchElement.addEventListener("keyup", () => {
    let searchstring = searchElement.value.toLowerCase();
    const filteredPOs = filterData(searchstring);
    displayPO(filteredPOs);
  });

  if (Array.isArray(post[0].PostOffice) && post.length > 0) {
    displayPO(post[0].PostOffice);
  }
}

var postOffice_list = null;

function displayPO(postOffices) {
  if (postOffice_list === null) postOffice_list = postOffices;
  const PO = document.getElementById("postOffice");
  PO.innerHTML = "";
  postOffices.forEach((postOffice) => {
    const po_card = document.createElement("div");
    po_card.className = "po-card";
    po_card.innerHTML = `
                <div>
                    <p><span>Name:   ${postOffice.Name}</span></p>
                </div>
                <div>
                    <p><span>Branch Type:   ${postOffice.BranchType}</span></p>
                </div>
                <div>
                    <p><span>Delivery Status:   ${postOffice.DeliveryStatus}</span></p>
                </div>
                <div>
                    <p><span>District:   ${postOffice.District}</span></p>
                </div>
                <div>
                    <p><span>Division:   ${postOffice.Division}</span></p>
                </div>
            `;
    PO.appendChild(po_card);
  });
}
button.addEventListener("click", getUserDetails);

function filterData(searchstring) {
  // filter here
  var ansArray = postOffice_list.filter((postOffice) => {
    if (
      postOffice.Name.toLowerCase().includes(searchstring) ||
      postOffice.Division.toLowerCase().includes(searchstring)
    ) {
      return postOffice;
    }
  });
  return ansArray;
}
