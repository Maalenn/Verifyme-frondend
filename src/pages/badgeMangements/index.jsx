import PageTitle from "../../components/PageTitle";
import SearchBar from "../../components/SearchBar";
import DashboardContainer from "../../components/styles/DashboardContainer";

const BadgeManagement = () => {
    return (
        <DashboardContainer sx={{ pb: 4 }}>
            <PageTitle title="Badge Management " />
            <SearchBar showButton={true} textInButton="Add Badge" />
        </DashboardContainer>
    );
};

export default BadgeManagement;
