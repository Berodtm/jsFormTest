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
    audienceRefinementId,
    duration
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
    this.duration = duration;
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
    let mappingLocation;

    if (asmLocations.length > 0) {
      mappingLocation = asmLocations.join(", ");
    } else {
      // Non-ASM case - determine the mapping location based on product, type, and placement
      mappingLocation = this.getNonAsmMappingLocation(aemId);
    }

    return mappingLocation;
  }

  getNonAsmMappingLocation(aemId) {
    // Define a map of product-type-placement combinations to references
    const referenceMap = {
      "hins-app-bpt": "APP|Logon|BPT",
      // Add more combinations here as needed
      "hins-app-lob": "APP|Logout|LOB",
      "hins-mbr-bpt": "MBR|Logon|BPT",
      "hins-dkp-bpt": "DKP|Logon|BPT, DKP|Logoff|BPT",
      // 'product-type-placement': 'Reference for PRODUCT TYPE PLACEMENT',
    };

    // Extract product, type, and placement from the aemId
    const productMatch = aemId.match(/\/hins\//) ? "hins" : "";
    const typeMatch = this.type.toLowerCase(); // 'app', 'dkp', 'mbr', etc.
    const placementMatch = this.placement.toLowerCase(); // 'lnk', 'asm', 'bpt', etc.

    // Create the key to search in the reference map
    const key = `${productMatch}-${typeMatch}-${placementMatch}`;

    // Return the corresponding reference or a default value
    return referenceMap[key] || "Default Reference";
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

const generateTable = () => {
  let table = '<table><tr><th>Field</th><th>Value</th></tr>';

  TargetMappingInstancesArray.forEach((submission, index) => {
    // Check if it's the start of a new submission group
    if (index === 0 || submission.leadId !== TargetMappingInstancesArray[index - 1].leadId) {
      table += `<tr><td>Name</td><td>${submission.name}</td></tr>`;
      table += `<tr><td>AEM ID</td><td>${submission.aemId}</td></tr>`;
      table += `<tr><td>Activity Name</td><td>${submission.leadId}</td></tr>`;
      table += `<tr><td>Objective</td><td>${submission.objective}</td></tr>`;
      table += `<tr><td>Type</td><td>${submission.type}</td></tr>`;
      table += `<tr><td>Placement</td><td>${submission.placement}</td></tr>`;
      table += `<tr><td>Test Type</td><td>${submission.testType}</td></tr>`;
      table += `<tr><td>Priority</td><td>${submission.priority}</td></tr>`;
      table += `<tr><td>Tokenised</td><td>${submission.tokenised}</td></tr>`;
      table += `<tr><td>Rated</td><td>${submission.rated}</td></tr>`;
      table += `<tr><td>Measured By</td><td>${submission.measuredBy}</td></tr>`;
      table += `<tr><td>Duration</td><td>${submission.duration}</td></tr>`;
    }
    // Add ASM-specific fields for each submission
    table += `<tr><td>Mapping Location</td><td>${submission.mappingLocation}</td></tr>`;
    table += `<tr><td>Audience Refinement</td><td>${submission.audienceRefinement}</td></tr>`;
  });

  table += '</table>';

  // Append the new table to the existing content
  document.getElementById('form-output').innerHTML += table;
};



let TargetMappingInstancesArray = [];

const addLeadSubmission = (e) => {
  e.preventDefault();

  let nameValue = document.getElementById("user-name").value;
  let aemIdValue = document.getElementById("aem-id").value.toLowerCase();
  let leadIdValue = document.getElementById("lead-id").value.toLowerCase();
  let objective = document.getElementById("objective-id").value.toLowerCase();
  let durationValue = document.getElementById("duration-id").value;

  if (checkDeviceTypeMismatch()) {
    // If there's a mismatch, do not proceed further
    return;
  }

  if (!nameValue || !aemIdValue || !leadIdValue || !objective) {
    alert("Remember to complete in all the fields.");
    return;
  }
  TargetMappingInstancesArray = []
  let asmLocations = [];
  if (aemIdValue.includes("/asm/")) {
    // ASM specific logic
    if (document.getElementById("location1").checked) {
      asmLocations.push("APP|Account Overview|ASM|ASM1");
    }
    if (document.getElementById("location2").checked) {
      asmLocations.push("APP|Account Overview|ASM|ASM2");
    }
    if (document.getElementById("location3").checked) {
      asmLocations.push("APP|Account Overview|ASM|ASM3");
    }

    asmLocations.forEach((location, index) => {
      let audienceRefinementId = leadIdValue.split("_")[0] + "_p" + (index + 1);
      let newLeadSubmission = new LeadSubmission(
        nameValue,
        aemIdValue,
        leadIdValue,
        objective,
        [location], // Pass a single location as an array
        audienceRefinementId,
        durationValue
      );
      TargetMappingInstancesArray.push(newLeadSubmission);
    });

    // Clear asmLocations after processing ASM logic
    asmLocations = [];
  } else {
    // General case for other scenarios like /bpt/
    let audienceRefinementId = leadIdValue.split("_")[0] + "_p1";
    let newLeadSubmission = new LeadSubmission(
      nameValue,
      aemIdValue,
      leadIdValue,
      objective,
      [], // Pass an empty array for non-ASM cases
      audienceRefinementId,
      durationValue
    );
    TargetMappingInstancesArray.push(newLeadSubmission);
  }

  document.getElementById("aem-id").value = "";
  document.getElementById("lead-id").value = "";
  console.warn("Added", { TargetMappingInstancesArray });

  const asmOptions = document.getElementById("asm-options");
  asmOptions.style.display = "none";
  generateTable();
};


// Function to extract device type
const getDeviceTypeFromId = (id) => {
  if (id.includes("app")) {
    return "app";
  } else if (id.includes("dkp")) {
    return "dkp";
  } else if (id.includes("mbr")) {
    return "mbr";
  }
  return null; // No device type found
};

// Function to check for device type mismatch
const checkDeviceTypeMismatch = () => {
  const aemIdValue = document.getElementById("aem-id").value.toLowerCase();
  const leadIdValue = document.getElementById("lead-id").value.toLowerCase();

  const aemDeviceType = getDeviceTypeFromId(aemIdValue);
  const leadDeviceType = getDeviceTypeFromId(leadIdValue);

  if (aemDeviceType && leadDeviceType && aemDeviceType !== leadDeviceType) {
    alert(
      `Mismatch in device type: AEM ID is ${aemDeviceType} and Activity Name is ${leadDeviceType}`
    );
    return true;
  } else return false;
};

// Event listeners for device type mismatch check
document
  .getElementById("aem-id")
  .addEventListener("input", checkDeviceTypeMismatch);
document
  .getElementById("lead-id")
  .addEventListener("input", checkDeviceTypeMismatch);

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
