const papers = {
    "Prelims-2024": {
        name: "Prelims-2024",
        json_loc: 'data/Prelims-2024'
    },
    "Prelims-2023": {
        name: "Prelims-2023",
        json_loc: 'data/Prelims-2023'
    },
    "Prelims-2022": {
        name: "Prelims-2022",
        json_loc: 'data/Prelims-2022'
    },
    "Prelims-2021": {
        name: "Prelims-2021",
        json_loc: 'data/Prelims-2021'
    },
    "Prelims-2020": {
        name: "Prelims-2020",
        json_loc: 'data/Prelims-2020'
    },
    "Prelims-2019": {
        name: "Prelims-2019",
        json_loc: 'data/Prelims-2019'
    }
};

// Default to "Prelims-2024"
let currentpaper = papers["Prelims-2024"];

const urlParams = new URLSearchParams(window.location.search);
console.log('Loaded URL parameters.');

if (urlParams.has('paper')) {
    const urlpaper = urlParams.get('paper');
    
    // Check if the paper exists in the papers object
    if (papers.hasOwnProperty(urlpaper)) {
        currentpaper = papers[urlpaper];
    } else {
        console.log('DeUnknown paper:', urlpaper);
    }
} else {
    console.log('No paper specified in the URL.');
}

const paper_name = currentpaper.name;
const paper_json = currentpaper.json_loc;

// Log results for debugging
console.log('Current paper name:', paper_name);
console.log('Current paper JSON location:', paper_json);
