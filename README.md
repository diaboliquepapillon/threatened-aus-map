# Where Do Australia's Threatened Animals Live?

## FIT3179 Data Visualisation 2 – Assignment

**Interactive data visualisation exploring Australia's threatened species by state and conservation status**

---

## 🎯 Project Overview

This project presents an interactive web-based visualisation of Australia's threatened animal species, showcasing:

- **Geographic distribution** of threatened species across Australian states/territories
- **Conservation status breakdown** (Critically Endangered, Endangered, Vulnerable)
- **Species group filtering** (Mammals, Birds, Reptiles, Amphibians, Fish)
- **Interactive state selection** to explore regional biodiversity patterns

---

## 📊 Data Sources

**Primary Dataset:**  
Australian Government – Department of Climate Change, Energy, the Environment and Water (DCCEEW)  
EPBC Act (Environment Protection and Biodiversity Conservation Act) Threatened Species Lists

**Dataset File:** `threatened_species.csv`

**Fields:**
- `state` – Australian state/territory code (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)
- `group` – Animal taxonomic group (Mammals, Birds, Reptiles, Amphibians, Fish)
- `status` – EPBC conservation status (Critically Endangered, Endangered, Vulnerable)
- `count` – Number of species in each category

---

## 🛠️ Technologies Used

- **Vega-Lite 5** – Declarative grammar for interactive visualizations
- **Vega-Embed 6** – Embed Vega visualizations in web pages
- **React 18** – Component-based UI framework
- **TypeScript** – Type-safe JavaScript
- **Tailwind CSS** – Utility-first CSS framework
- **shadcn/ui** – Accessible React component library

---

## 🚀 Deployment

This project is built with **Vite** and optimized for deployment on **GitHub Pages**.

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### GitHub Pages Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to GitHub Pages via your repository settings

3. Access your site at: `https://<your-username>.github.io/<repo-name>/`

---

## 📁 Project Structure

```
├── public/
│   └── threatened_species.csv     # Dataset
├── src/
│   ├── components/
│   │   └── VegaLiteChart.tsx      # Vega-Lite chart wrapper component
│   ├── pages/
│   │   └── Index.tsx              # Main visualisation page
│   └── index.css                  # Design system (beige academic theme)
├── index.html                     # HTML entry point
└── README.md                      # This file
```

---

## 🎨 Design Philosophy

The visualisation follows **academic data journalism principles**:

- **Clean typography** (Open Sans font family)
- **Accessible color palette** (earth tones: ochre, eucalyptus, coral)
- **Subtle animations** (600ms ease transitions)
- **Responsive layout** (optimized for 13-inch laptops, no horizontal scroll)
- **Balanced white space** for visual clarity

---

## 📖 Usage Instructions

1. **Filter by species group** using the dropdown menu (Mammals, Birds, etc.)
2. **Click on state buttons** to filter the bar chart by region
3. **Hover over chart elements** for detailed tooltips
4. **Read the key insight** highlighting Queensland's biodiversity hotspots

---

## 👤 Author

**FIT3179 Student**  
Monash University | 2025  
Unit: FIT3179 Data Visualisation 2

---

## 📜 License

Educational project for FIT3179 coursework.  
Data sourced from Australian Government open data portals.

---

## 🙏 Acknowledgments

- **Vega Team** – For the declarative visualisation grammar
- **DCCEEW** – For providing EPBC Act threatened species data
- **FIT3179 Teaching Team** – For assignment guidelines and support

---

**Last Updated:** April 2025
