# 🗺️ Interactive Map App

**A fully interactive mapping application built with Angular and Leaflet.js**  
Allows users to **add, remove, and manage markers, lines, and polygons** on a map.

---

## **Key Features**

- Select a tool (Marker, Line, Polygon)\*\*
- Ability to add more tools to the app\*\*
- Save and restore map features using `localStorage`\*\*
- Focus on a selected feature\*\*

---

## Installation

To get started with the project, follow these steps:

1. **Clone the repository**

   ```sh
   git clone https://github.com/barel121/InteractiveMapApp.git
   cd InteractiveMapApp
   ```

2. **Install dependencies**
   Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:

   ```sh
   npm install
   ```

3. **Run the application**
   To start the development server, use the following command:
   ```sh
   npm start
   ```
   The application will be running at `http://localhost:4200`.
4. **Running unit tests**
   To run the tests use the following command:
   ```sh
   ng test
   ```
   **Unit test has been wrote for the map-data service**

---

## Add more tools to the application

The app supports easy tool expansion. To add a new tool:
For example we are adding circle to the tool list.
Head to src/tools/utils/tools.ts, following this structure:

```ts
    {
    toolName: 'circle',
        displayName: 'Draw Circle',
        action: (map, drawnItems, tempPoints, latlngs) => {
            const circle = L.circle(latlngs[0], { radius: 500, color: 'red' }).addTo(map);
            drawnItems.addLayer(circle);
            return circle;
        },
        focus: (map, layer) => {
            if (layer instanceof L.Circle) map.fitBounds(layer.getBounds());
        },
    },
```

The tool will automatically appear in the UI

---

## **Technologies Used**

- **Angular 18+**
- **Leaflet.js**
- **RxJS Signals** (for state management)
- **Jasmine & Karma** (for unit testing)
- **Angular Material**
