import { Ion, Viewer, CesiumTerrainProvider } from "cesium";


interface ViewerOptions {
    timeline?: boolean;
    infoBox?: boolean;
}

export function initCesium(token: string) {
    Ion.defaultAccessToken = token;

    const loadBaseViewer = async (
        container: HTMLElement, 
        terrainId: number = 3956,
        options: Partial<ViewerOptions>) => {
            try {
              const terrainProvider = await CesiumTerrainProvider.fromIonAssetId(
                terrainId,
                {
                  requestVertexNormals: true,
                }
              );
        
              return new Viewer(container, {
                terrainProvider: terrainProvider,
                ...options,
              });
            } catch (error) {
              console.error("Failed to initialize Cesium Viewer:", error);
              throw error;
            }
        };

    return {loadBaseViewer}
}