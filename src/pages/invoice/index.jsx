// React import
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// MUI import
import { Box, Typography } from "@mui/material";

// Custom import
import DashboardContainer from "../../components/styles/DashboardContainer";
import TableCustom from "../../components/TableCustom";
import PageTitle from "../../components/PageTitle";
import SkeletonLoading from "../../components/loading/SkeletonLoading";
import AlertMessage from "../../components/alert/AlertMessage";
import FormatDate from "../../utils/formatDate";
import theme from "../../assets/themes";

// Fetching import
import { useGetSubInstitutionQuery } from "../../store/api/subscription/subscriptionApi";

// =========== Start InvoiceManagement ===========
const InvoiceManagement = () => {
    const { roleId, institutionData } = useSelector((state) => state.global);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Get query for requesting
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    // Fetching data
    const institutionId = institutionData?.id || queryParams.get("institutionId");
    const { data: response, isLoading, isError } = useGetSubInstitutionQuery(institutionId);
    const instiData = response?.data || [];

    // Filter data based on search query
    const filteredData = instiData.filter((invoice) => {
        const organizationName = invoice.name?.toLowerCase() || "";
        const subscriptionPlan = invoice.ServicePlan?.name?.toLowerCase() || "";
        return (
            organizationName.includes(searchQuery.toLowerCase()) ||
            subscriptionPlan.includes(searchQuery.toLowerCase())
        );
    });

    // Total paid price
    const totalPaid = instiData.reduce((accumulator, current) => {
        return accumulator + parseFloat(current.ServicePlan?.price || 0);
    }, 0);

    // Invoice columns
    const invoiceColumns = [
        ...(roleId === 2
            ? []
            : [
                {
                    name: "Organization Name",
                    selector: (row) => row.name,
                    sortable: true,
                },
            ]),
        {
            name: "Subscription Plan",
            selector: (row) => row.ServicePlan?.name,
            sortable: true,
        },
        {
            name: "Subscription Price",
            selector: (row) => row.ServicePlan?.price,
            sortable: true,
        },
        {
            name: "Plan Start Date",
            selector: (row) => FormatDate(row.startDate),
            sortable: true,
        },
        {
            name: "Plan Expiry Date",
            selector: (row) => FormatDate(row.endDate),
            sortable: true,
        },
    ];

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        (currentPage - 1) * rowsPerPage + rowsPerPage
    );

    return (
        // ============ Start dashboard container ============
        <DashboardContainer>
            {isError && <AlertMessage variant="error">Error fetching data</AlertMessage>}
            {/* Page Title */}
            <PageTitle title="Invoice" />

            {/* Table Data */}
            {isLoading ? (
                <SkeletonLoading num={5} />
            ) : (
                <TableCustom
                    title="Invoice"
                    data={paginatedData}
                    columns={invoiceColumns}
                    onSearch={setSearchQuery}
                    pagination
                    totalRows={instiData.length}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={(newRowsPerPage) => {
                        setRowsPerPage(newRowsPerPage);
                        setCurrentPage(1);
                    }}
                />
            )}
            <Box
                sx={{
                    width: "100%",
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    bgcolor: theme.palette.secondary.dark,
                    p: [4, 2],
                }}
            >
                <Box>
                    <Typography variant="h4" color={theme.palette.customColors.white}>
                        Total Paid: ${totalPaid.toFixed(2)}
                    </Typography>
                </Box>
            </Box>
            {/* Start total price container */}

            {/* End total price container */}
        </DashboardContainer>
        // ============ End dashboard container ============
    );
};

export default InvoiceManagement;
// =========== Start InvoiceManagement ===========