import { useParams } from "react-router-dom";
import LandingPageData from '../static/landingPage';
import MainLayout from '../layout/Main';

const IframePage = ({ urlTitle, url, menuData, activePage, activePageLayout, handlePageChange }) => {
    const { playlistTitle } = useParams();
    const decodedTitle = decodeURIComponent(urlTitle || playlistTitle);

    return (
        <>
            <MainLayout
                menuData={menuData}
                activePage={activePage}
                handlePageChange={handlePageChange}
                activePageLayoutType={activePageLayout.layout}
                copyRightText={LandingPageData.copyRight}
            >
                <div style={{ position: "absolute", width: "100%", height: "calc(100vh - 8px)", top: "0px" }} className={`${playlistTitle === "Subscribe" ? "subscribe_top_menu" : ""}`}>
                    <iframe
                        src={url}
                        title={decodedTitle}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                </div>
            </MainLayout>
        </>
    );
};

export default IframePage;
