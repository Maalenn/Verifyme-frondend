// MUI Import
import { Box, Typography, CircularProgress } from "@mui/material";

// Custom Import
import TableCustom from "../../components/TableList";
import MenuSelection from "../../components/TableAction/MenuSelection";
import FormatYear from "../../utils/fomatYear";

// Fetching Data Import
import { useFetchEarnerQuery } from "../../store/api/earnerManagement/earnerApis";

// ============ Start Table Earner Modal Custom Button ============
const TableEarner = ({ onView, onDelete, userId }) => {
    const { data: response, isLoading, isError } = useFetchEarnerQuery();
    const earnerData = response?.data;


    const earnerColumns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row.User.username,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.User.email,
            sortable: true,
        },
        {
            name: "Badge",
            selector: (row) => row.Achievement.BadgeClass.name,
            sortable: true,
        },
        {
            name: "Academic Year",
            selector: (row) => FormatYear(row.AcademicBackground.academicYear),
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <MenuSelection
                    onView={() => onView(row.id)}
                    onDelete={() => onDelete(row.id)}
                />
            ),
        },
    ];

    return (
        <Box>
            {isLoading ? (
                <CircularProgress />
            ) : isError ? (
                <Typography color="error">Error fetching data</Typography>
            ) : (
                <TableCustom title="Earner List" data={earnerData} columns={earnerColumns} />
            )}
        </Box>
    );
};

export default TableEarner;
// ============ End Table Earner Modal Custom Button ============