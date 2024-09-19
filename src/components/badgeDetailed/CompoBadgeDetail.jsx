// React library import
import React from "react";

// MUI Import
import {
            Typography,
            Stack,
            Box
        }   from    "@mui/material";

// Custome Import
import PageSection from "./smallComponent/PageSection";
import theme from "../../assets/themes";

// <!-- ============ Start BadgeDetail component ============ -->
const BadgeDetail = ({data}) => {
    return (

            <PageSection >

            {/*  Start container  */}
                <Stack gap={4} py={2}>
                        {/* Iterate over DetailData.items and render content */}
                        {data.items.map((item, index) => (
                            <Stack
                                key={item.id} // Added unique key prop
                                flexDirection="row"
                                gap={2}
                                sx={{
                                    pl: "32px",

                                    width: "100%",
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" }, // Adjust direction based on screen size
                                    justifyContent: "flex-start",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textAlign: {md:"right"},
                                        fontWeight: theme.fontWeight.bold,
                                        // fontSize: theme.typography.body1,
                                        width: "100%",
                                        maxWidth: { xs: "25%", md: "150px" }, // Adjust width for responsiveness
                                    }}
                                >
                                    {item.Lable} :
                                </Typography>
                                {item.ReactCode ? (
                                    <Stack sx={{ width: { xs: "100%", md: "75%" } }}>
                                        {item.ReactCode} {/* Render as JSX */}
                                    </Stack>
                                ) : (
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            width: { xs: "100%", md: "75%" }, // Adjust width for responsiveness
                                            ...item.sx,
                                        }}
                                    >
                                        {item.Detail}
                                    </Typography>
                                )}
                            </Stack>
                        ))}
                </Stack>
            </PageSection>
    );
};
// <!-- ============ End BadgeDetail component ============ -->

export default BadgeDetail;