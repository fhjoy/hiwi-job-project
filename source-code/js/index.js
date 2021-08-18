let ADDITIONAL_DISTANCE = 50;
let IDEAL_DISTANCE = 0;
let ARP_CACHE_JSON = "./datasource/arpCache.json";
let NETWORK_DIRECTION_JSON = "./datasource/networkDirection.json";
var animateObj = animate;
animateObj.frameRate = 2;

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dataDiv").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";
  var networkingDevicesDiv = document.getElementById("networkingDevices");
  var positionInfo = networkingDevicesDiv.getBoundingClientRect();
  var height = positionInfo.height;
  var width = positionInfo.width;
  let moveIndex = 0;
  let distanceToMove = 0;
  let networkingPathArray = [];
  let arpCache = [];
  fetch(ARP_CACHE_JSON)
    .then((response) => {
      arpCache = response.json();
      return arpCache;
    })
    .then(function (data) {
      arpCache = data;
      fetch(NETWORK_DIRECTION_JSON)
        .then((response) => {
          networkingPathArray = response.json();
          return networkingPathArray;
        })
        .then(function (data) {
          let getFilteredArpCacheBy = function (key, value) {
            return arpCache.filter(function (arp) {
              return arp[key] == value;
            });
          };
          networkingPathArray = data;
          distanceToMove =
            width / networkingPathArray.length + ADDITIONAL_DISTANCE;
          IDEAL_DISTANCE = distanceToMove;
          let networkingDevicces = "";
          networkingPathArray.forEach((element) => {
            let type = element.type;
            let receiver = element.routingTable[0].receiver;
            let sender = element.routingTable[0].sender;
            let filterResult = getFilteredArpCacheBy(
              "physicalAddress",
              receiver
            );
            let internetAddress =
              filterResult.length > 0
                ? filterResult[0].internetAddress
                : receiver;
            if (type == "router") {
              filterResult = getFilteredArpCacheBy("physicalAddress", sender);
              let senderInternetAddress =
                filterResult.length > 0
                  ? filterResult[0].internetAddress
                  : sender;
              networkingDevicces +=
                `<div class="col col-md-3">
                        <span>` +
                internetAddress +
                ` ` +
                senderInternetAddress +
                `</span><br/>` +
                receiver +
                ` ` +
                sender +
                `
                    </div>`;
            } else if (type == "client") {
              networkingDevicces +=
                `<div class="col col-md-3">
                        <span>` +
                internetAddress +
                `</span><br/>` +
                receiver +
                `
                    </div>`;
            } else if (type == "server") {
              networkingDevicces +=
                `<div class="col col-md-3">
                        <span>` +
                internetAddress +
                `</span><br/>` +
                receiver +
                `
                    </div>`;
            }
          });

          document.getElementById(
            "networkingDevices"
          ).innerHTML = networkingDevicces;
        });
    });
  let resetNetworkingComponents = function () {
    document.getElementById("startBtn").removeAttribute("disabled");
    document.getElementById("nextBtn").innerHTML = "Next";
    document.getElementById("dataDiv").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("startBtn").removeAttribute("style");

    document
      .getElementById("networkingImage")
      .setAttribute("src", "./images/network_with_four_components-offline.png");
    document.getElementById("sourceIp").innerHTML = "";
    document.getElementById("destinationIp").innerHTML = "";
    document.getElementById("macAddressSender").innerHTML = "";
    document.getElementById("macAddressReceiver").innerHTML = "";
    moveIndex = 0;
    animateObj.terminalPosition = ADDITIONAL_DISTANCE;
    // $("#dataDiv").animate({ left: 160 + "px" }, "slow");
  };

  document.getElementById("nextBtn").style.display = "none";
  let getFilteredArpCacheBy = function (key, value) {
    return arpCache.filter(function (arp) {
      return arp[key] == value;
    });
  };
  let nextBtnClickEvent = function () {
    document.getElementById("firstRouterTable").innerHTML = "";
    document.getElementById("secondRouterTable").innerHTML = "";
    animateObj.MAX = width - ADDITIONAL_DISTANCE * networkingPathArray.length;
    moveIndex++;
    if (moveIndex >= networkingPathArray.length) {
      resetNetworkingComponents();
    } else {
      document.getElementById("nextBtn").innerText = "Next";
      document.getElementById("nextBtn").style.display = "";
      let source = networkingPathArray[moveIndex].routingTable[0].source;
      let destination =
        networkingPathArray[moveIndex].routingTable[0].destination;
      let previous = moveIndex - 1;

      let position = networkingPathArray[moveIndex].position;
      let type = networkingPathArray[moveIndex].type;
      let routerNo = type == "router" ? Math.ceil(position / 2) : "null";

      let next = networkingPathArray[previous].routingTable[0].next;
      let sender = networkingPathArray[previous].routingTable[0].sender;
      let receiver = networkingPathArray[previous].routingTable[0].next;

      let filterResult = getFilteredArpCacheBy("physicalAddress", source);
      let sourceInternetAddress =
        filterResult.length > 0 ? filterResult[0].internetAddress : source;

      filterResult = getFilteredArpCacheBy("physicalAddress", destination);
      let destinationInternetAddress =
        filterResult.length > 0 ? filterResult[0].internetAddress : destination;

      document.getElementById("sourceIp").innerText = sourceInternetAddress;
      document.getElementById(
        "destinationIp"
      ).innerText = destinationInternetAddress;
      document.getElementById("macAddressSender").innerText = sender;
      document.getElementById("macAddressReceiver").innerText = receiver;

      let routingTable = networkingPathArray[moveIndex].routingTable;
      let arpTable = networkingPathArray[moveIndex].arpTable;

      animateObj.start = function () {
        console.log("animation start");
        document.getElementById("startBtn").setAttribute("disabled", true);
        document.getElementById("nextBtn").setAttribute("disabled", true);
        document.getElementById("firstRouterTable").style.display = "none";
        // $("#secondRouterTable").hide();
        this.innerHTML =
          "<div><span style='background-color:gray;'>&nbsp;&nbsp;&nbsp;</span><span style='background-color:silver;'>IP</span><span style='background-color:red;'>MAC</span></div>";
      };
      animateObj.stop = function () {
        document.getElementById("nextBtn").removeAttribute("disabled");
        let tables = "";
        let routingTableHtml =
          "<table class='table table-sm table-striped table-bordered'>";
        let routingTableRows =
          "<tr>" +
          "<th colspan='3' style='background-color:skyblue;'>Routing Table R" +
          routerNo +
          "</th>" +
          "</tr>";
        routingTableRows +=
          "<tr>" +
          "<th>Destination Ip</th>" +
          "<th>Next Ip</th>" +
          "<th>Link</th>" +
          "</tr>";
        routingTable.forEach((element) => {
          let arpCacheTemp = getFilteredArpCacheBy(
            "physicalAddress",
            element.destination
          );
          let destination =
            arpCacheTemp.length > 0
              ? arpCacheTemp[0].internetAddress
              : element.destination;
          arpCacheTemp = getFilteredArpCacheBy("physicalAddress", element.next);
          let next =
            element.destination !== element.next && arpCacheTemp.length > 0
              ? arpCacheTemp[0].internetAddress
              : "-";
          routingTableRows += "<tr>";
          routingTableRows += "<td>";
          routingTableRows += destination;
          routingTableRows += "</td>";

          routingTableRows += "<td>";
          routingTableRows += next;
          routingTableRows += "</td>";

          routingTableRows += "<td>";
          routingTableRows += element["link"];
          routingTableRows += "</td>";

          routingTableRows += "</tr>";
        });
        routingTableHtml += routingTableRows;
        routingTableHtml += "</table>";

        let arpTableHtml =
          "<table class='table table-sm table-striped table-bordered'>";
        let arpTableRows =
          "<tr>" +
          "<th colspan='3' style='background-color:skyblue;'>ARP Table R" +
          routerNo +
          "</th>" +
          "</tr>";

        arpTableRows +=
          "<tr>" +
          "<th>Ip Address</th>" +
          "<th>MAC Address</th>" +
          "<th>Time</th>" +
          "</tr>";

        arpTable.forEach((element) => {
          arpCacheTemp = getFilteredArpCacheBy("physicalAddress", element.next);
          let nextInternetAddress =
            arpCacheTemp.length > 0
              ? arpCacheTemp[0].internetAddress
              : element.next;

          arpTableRows += "<tr>";
          arpTableRows += "<td>";
          arpTableRows += nextInternetAddress;
          arpTableRows += "</td>";

          arpTableRows += "<td>";
          arpTableRows += element.next;
          arpTableRows += "</td>";

          arpTableRows += "<td>";
          arpTableRows += element.time;
          arpTableRows += "</td>";

          arpTableRows += "</tr>";
        });
        arpTableHtml += arpTableRows;
        arpTableHtml += "</table>";

        tables += "<div class='col col-md-6'>" + routingTableHtml + "</div>";
        tables += "<div class='col col-md-6'>" + arpTableHtml + "</div>";
        document.getElementById("firstRouterTable").innerHTML = "";
        document.getElementById("secondRouterTable").innerHTML = "";
        if (moveIndex % 2 == 0 && type == "router") {
          document.getElementById("firstRouterTable").style.display = "none";
          document.getElementById("secondRouterTable").innerHTML = tables;
          document.getElementById("secondRouterTable").style.display = "";
        }
        if (moveIndex % 2 == 1 && type == "router") {
          document.getElementById("firstRouterTable").innerHTML = tables;
          document.getElementById("firstRouterTable").style.display = "";
        } else {
          document.getElementById("firstRouterTable").style.display = "none";
        }

        this.innerHTML =
          "<div><span style='background-color:gray;'>&nbsp;&nbsp;&nbsp;</span><span style='background-color:silver;'>IP</span><span style='background-color:red;'>MAC</span></div>";
        console.log("animation stop");
      };
      animateObj.complete = function () {
        document.getElementById("nextBtn").removeAttribute("disabled");
        document.getElementById("startBtn").style.display = "none";
        document.getElementById("nextBtn").innerText = "Reset";
        console.log("animation completed!");
      };
      animateObj.move(distanceToMove, "dataDiv");
    }
  };
  document.getElementById("firstRouterTable").style.display = "none";
  document.getElementById("startBtn").addEventListener("click", function () {
    document.getElementById("dataDiv").style.display = "";
    document.getElementById("startBtn").setAttribute("disabled", true);
    document
      .getElementById("networkingImage")
      .setAttribute("src", "./images/network_with_four_components-online.png");
    document.getElementById("nextBtn").innerHTML = "Next";
    document.getElementById("nextBtn").setAttribute("disabled", false);
    nextBtnClickEvent();
  });
  document
    .getElementById("nextBtn")
    .addEventListener("click", nextBtnClickEvent);
});
