import { useParams } from "react-router-dom";
import IframePage from "./IframePage";
import Home from "./Home";
import { getAdditionalTopMenuDetails } from "../services/channelData.service";
import { useEffect, useState } from "react";

const DynamicPage = ({ menuData, activePage, activePageLayout, handlePageChange }) => {
  const { playlistTitle } = useParams();
  const decodedTitle = decodeURIComponent(playlistTitle);
  const [iframeData, setIframeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdditionalTopMenuDetails();
        if (data?.content) {
          const matched = data.content.find(
            (item) => item.name === decodedTitle
          );
          setIframeData(matched || null);
        }
      } catch (error) {
        console.error("Error fetching iframe details:", error);
      }
    };

    fetchData();
  }, [decodedTitle]);

  if (iframeData) {
    return (
      <IframePage
        urlTitle={iframeData.name}
        url={iframeData.url}
        menuData={menuData}
        activePage={activePage}
        activePageLayout={activePageLayout}
        handlePageChange={handlePageChange}
      />
    );
  } else {
    return (
      <Home
        key={activePage}
        menuData={menuData}
        activePage={activePage}
        activePageLayout={activePageLayout}
        handlePageChange={handlePageChange}
      />
    );
  }
};

export default DynamicPage;
