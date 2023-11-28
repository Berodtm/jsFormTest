document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the name from localStorage
  const savedName = localStorage.getItem("userName");
  if (savedName) {
    document.getElementById("user-name").value = savedName;
  }
});

document.getElementById("user-name").addEventListener("input", function (e) {
  // Save the name to localStorage whenever it changes
  localStorage.setItem("userName", e.target.value);
});

// Define the LeadSubmission class
class LeadSubmission {
  constructor(
    name,
    aemId,
    leadId,
    objective,
    asmLocations,
    audienceRefinementId
  ) {
    this.name = name;
    this.aemId = aemId;
    this.leadId = leadId;
    this.objective = objective;
    this.type = this.determineType(aemId);
    this.placement = this.determinePlacement(aemId);
    this.testType = this.determineTestType(leadId);
    this.mappingLocation = this.determineMappingLocation(aemId, asmLocations);
    this.priority = this.determinePriority(leadId);
    this.tokenised = this.determineTokenised(aemId);
    this.rated = this.determineRated(aemId);
    this.measuredBy = this.determineMeasuredBy(leadId);
    this.audienceRefinement = audienceRefinementId;
  }

  determineType(aemId) {
    if (aemId.includes("/dkp/")) {
      return "Desktop";
    } else if (aemId.includes("/app/")) {
      return "App";
    } else if (aemId.includes("/mbr/")) {
      return "Mobile Browser";
    } else {
      return "device type Unknown";
    }
  }

  determinePlacement(aemId) {
    if (aemId.includes("/lnk/")) {
      return "lnk".toUpperCase();
    } else if (aemId.includes("/asm/")) {
      return "asm".toUpperCase();
    } else if (aemId.includes("/bpt/")) {
      return "bpt".toUpperCase();
    } else if (aemId.includes("/til/")) {
      return "til".toUpperCase();
    } else if (aemId.includes("/eal/")) {
      return "eal".toUpperCase();
    } else if (aemId.includes("/fea/")) {
      return "fea".toUpperCase();
    } else if (aemId.includes("/nvt/")) {
      return "nvt".toUpperCase();
    } else if (aemId.includes("/phl/")) {
      return "phl".toUpperCase();
    } else if (aemId.includes("/lob/")) {
      return "lob".toUpperCase();
    } else if (aemId.includes("/pom/")) {
      return "pom".toUpperCase();
    } else {
      return "Placement Unknown";
    }
  }
  determineTestType(leadId) {
    if (leadId.includes("_ab_")) {
      return "AB";
    } else {
      return "XT";
    }
  }
  determineMappingLocation(aemId, asmLocations) {
    let placementType = this.getPlacementType(aemId);
    let mappingLocations;

    if (asmLocations.length > 0) {
      // ASM case
      mappingLocations = asmLocations.join(", ");
    } else {
      // Non-ASM case
      mappingLocations = "Default Reference"; // Replace with your specific non-ASM reference
    }

    return placementType + " | " + mappingLocations;
  }
  getPlacementType(aemId) {
    if (aemId.includes("/dkp/")) {
      return "DKP";
    } else if (aemId.includes("/app/")) {
      return "APP";
    } else if (aemId.includes("/mbr/")) {
      return "MBR";
    } else {
      return "Unknown Placement";
    }
  }
  determinePriority(leadId) {
    if (leadId.includes("_ab_")) {
      return "1";
    } else {
      return "0";
    }
  }
  determineTokenised(aemId) {
    if (aemId.includes("/ty/")) {
      return "Yes - Tokenised";
    } else {
      return "No - Non-tokenised";
    }
  }
  determineRated(aemId) {
    if (aemId.includes("/ry/")) {
      return "Yes: Rated";
    } else {
      return "No: No rates";
    }
  }
  determineMeasuredBy(leadId) {
    if (leadId.includes("rotational")) {
      return "Additional Metrics";
    } else {
      return "Page views and engagement";
    }
  }
  determineAudienceRefinement(leadId) {
    // Assuming the audience refinement suffix is already appended to the leadId
    let baseId = leadId.split("_")[0];
    let refinementSuffix = leadId.substring(baseId.length); // Get the part after the baseId
    return baseId + refinementSuffix;
  }
}

let TargetMappingInstancesArray = [];

const addLeadSubmission = (e) => {
  e.preventDefault();

  let nameValue = document.getElementById("user-name").value;
  let aemIdValue = document.getElementById("aem-id").value.toLowerCase();
  let leadIdValue = document.getElementById("lead-id").value.toLowerCase();
  let objective = document.getElementById("objective-id").value.toLowerCase();

  if (!nameValue || !aemIdValue || !leadIdValue || !objective) {
    alert("Remember to complete in all the fields.");
    return;
  }
  let asmLocations = [];
  if (aemIdValue.includes("/asm/")) {
    // ASM specific logic

    if (document.getElementById("location1").checked)
      asmLocations.push("Account Overview | ASM | ASM1");
    if (document.getElementById("location2").checked)
      asmLocations.push("Account Overview | ASM | ASM2");
    if (document.getElementById("location3").checked)
      asmLocations.push("Account Overview | ASM | ASM3");

    asmLocations.forEach((location, index) => {
      let audienceRefinementId = leadIdValue.split("_")[0] + "_p" + (index + 1);
      let newLeadSubmission = new LeadSubmission(
        nameValue,
        aemIdValue,
        leadIdValue,
        objective,
        [location], // Pass a single location as an array
        audienceRefinementId
      );
      TargetMappingInstancesArray.push(newLeadSubmission);
    });
  } else {
    // General case for other scenarios like /bpt/
    let audienceRefinementId = leadIdValue.split("_")[0] + "_p1";
    let newLeadSubmission = new LeadSubmission(
      nameValue,
      aemIdValue,
      leadIdValue,
      objective,
      [], // Pass an empty array for non-ASM cases
      audienceRefinementId
    );
    TargetMappingInstancesArray.push(newLeadSubmission);
  }

  document.querySelector("#form-container form").reset();
  console.warn("Added", { TargetMappingInstancesArray });
  let pre = document.querySelector("#form-output pre");
  pre.textContent = "\n" + JSON.stringify(TargetMappingInstancesArray, "\t", 2);

  const asmOptions = document.getElementById("asm-options");
  asmOptions.style.display = "none";
};

document.getElementById("submit").addEventListener("click", addLeadSubmission);

//event listeners

document.getElementById("submit").addEventListener("click", addLeadSubmission);

document.getElementById("aem-id").addEventListener("input", function (e) {
  const asmOptions = document.getElementById("asm-options");
  if (e.target.value.includes("/asm/")) {
    asmOptions.style.display = "block";
  } else {
    asmOptions.style.display = "none";
  }
});

// For display
// let displayContent = '';
// TargetMappingInstancesArray.forEach((submission) => {
//     displayContent += '{\n';
//     for (let key in submission) {
//         let displayKey = keys(key); // Get the display key name
//         displayContent += `  "${displayKey}": "${submission[key]}",\n`; // Use the display key name
//     }
//     displayContent += '}\n';
// });

// let pre = document.querySelector('#form-output pre');
// pre.textContent = '\n' + displayContent;

// const keys = (key) => {
//   const keyMap = {
//     aemId: "AEM ID",
//     leadId: "Lead ID",
//     // more mappings...
//   };
//   return keyMap[key] || key;
// };
// let objectKey = 'aemId';
// let displayKey = formatKey(objectKey); // Converts to 'AEM ID'
