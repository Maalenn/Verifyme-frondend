// React library import
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// MUI import
import { AppBar, Box, Toolbar, Button, Menu, MenuItem, Slide, Stack, Typography, IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Custom import
import LandingContainer from "../../components/styles/LandingContainer";
import AlertConfirmation from "../../components/alert/AlertConfirmation";
import DefaultProfileSvg from "../../assets/images/DefaultProfile.svg";
import RatifyMeLogo from "../../assets/icons/RatfiyME.svg";
import MaleUserDefault from "../../assets/images/MaleUser.svg";
import FemaleUserDefault from "../../assets/images/FemaleUser.svg";
import useCatchStatus from "../../hooks/useCatchStatus";
import AlertMessage from "../../components/alert/AlertMessage";
import theme from "../../assets/themes";

// API import
import { useLogoutMutation } from "../../store/api/auth/authApi";
import { useGetSubInstitutionQuery } from "../../store/api/subscription/subscriptionApi";


const useHideOnScroll = () => {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
            setShow(false);
        } else {
            setShow(true);
        }
        setLastScrollY(window.scrollY);
    };

    useState(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return show;
};

// ============ Start Navbar ============
const Navbar = () => {
    const [navbarAnchorEl, setNavbarAnchorEl] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const { institutionData, userInfo } = useSelector((state) => state.global);
    const navigate = useNavigate();

    const gender = userInfo?.Gender?.name;
    const profileImage =
        userInfo?.profileImage ||
        (gender === "male" ? MaleUserDefault : gender === "female" ? FemaleUserDefault : DefaultProfileSvg);

    const institutionId = institutionData?.id;

    const { data: subscriptionOfInstitution } = useGetSubInstitutionQuery(institutionId);
    const subscriptions = subscriptionOfInstitution?.data || [];
    const filteredSubscriptions = subscriptions.filter((sub) => sub.status === true);

    const hasActiveSubscription = filteredSubscriptions.length > 0;

    const show = useHideOnScroll();
    const openNavbarMenu = Boolean(navbarAnchorEl);

    const [logout, { isError, error, isSuccess }] = useLogoutMutation();
    const [message, setMessage] = useCatchStatus(isSuccess || isError, isSuccess ? "Logout successfully" : error?.data?.message);

    const handleMenuOpen = (event) => {
        setNavbarAnchorEl(event.currentTarget);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const openProfileMenu = Boolean(anchorEl);

    const handleMenuClose = () => {
        setNavbarAnchorEl(null);
    };

    const handleMenuCloseProfile = () => {
        setAnchorEl(null);
    };

    const handleServicePlanClick = (e) => {
        if (!hasActiveSubscription) {
            e.preventDefault();
            setAlertTitle("Subscription Inactive");
            setAlertMessage(
                "Your subscription is currently inactive. Please choose a service plan to access our digital badge platform.",
            );
            setAlertOpen(true);
        }
    };

    const handleLogout = async () => {
        await logout().unwrap();
        navigate("/");
    };

    const handleConfirm = () => {
        handleLogout();
        setAlertOpen(false);
    };

    const handleCancel = () => {
        setAlertOpen(false);
    };

    const handleProfileMenuItemClick = (e) => {
        handleServicePlanClick(e);
        handleMenuCloseProfile();
    };

    // Updated handleMenuProfileClick to toggle the profile menu
    const handleMenuProfileClick = (event) => {
        // Toggle the profile menu
        if (openProfileMenu) {
            handleMenuCloseProfile(); 
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const buttonStyle = {
        color: "text.primary",
        fontWeight: theme.fontWeight.bold,
        borderRadius: theme.shape.borderRadius.btn,
    };

    const menuResItem = {
        borderRadius: "0px",
        backgroundColor: "inherit",
        color: `${theme.palette.text.primary}`,
        fontWeight: theme.fontWeight.bold,
    };

    return (
        <>
            {message && (
                <AlertMessage variant={isSuccess ? "success" : "error"} onClose={() => setMessage("")}>
                    {message}
                </AlertMessage>
            )}
            <Slide appear={false} direction="down" in={show}>
                <AppBar
                    position="sticky"
                    sx={{
                        backgroundColor: theme.palette.customColors.white,
                        border: `1px solid ${theme.palette.text.light}`,
                        px: "8px",
                    }}
                >
                    <LandingContainer>
                        <Toolbar disableGutters sx={{ width: "100%" }}>
                            <Box flexGrow={1} display={"flex"}>
                                <Link to={"/"}>
                                    <Box component="img" sx={{ width: 120 }} alt="The house from the offer." src={RatifyMeLogo} />
                                </Link>
                            </Box>

                            {/* Main Navbar */}
                            <Box
                                sx={{
                                    display: {
                                        xss: "none",
                                        md: "flex",
                                        gap: "100px",
                                    },
                                }}
                            >
                                <Box display={"flex"} gap={2} alignItems="center">
                                    <Link to="/price">
                                        <Button sx={buttonStyle}>Price</Button>
                                    </Link>
                                    <Link to="/contactus">
                                        <Button sx={buttonStyle}>Contact Us</Button>
                                    </Link>

                                    {institutionData && userInfo ? (
                                        <Link to="/dashboard" onClick={handleServicePlanClick}>
                                            <Stack direction="row" gap={1} alignItems="center">
                                                <Box
                                                    component="img"
                                                    src={profileImage}
                                                    alt="Profile Icon"
                                                    style={{ borderRadius: "50%", width: "32px", height: "32px" }}
                                                />
                                                <Box>
                                                    <Typography variant="body2" color={theme.palette.customColors.gray600}>
                                                        {userInfo?.firstName} {userInfo?.lastName}
                                                    </Typography>
                                                    <Typography variant="body2" color={theme.palette.customColors.gray500}>
                                                        {institutionData?.institutionName}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to="/auth/login">
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: theme.customShape.btn,
                                                        fontWeight: theme.fontWeight.bold,
                                                    }}
                                                >
                                                    Sign In
                                                </Button>
                                            </Link>
                                            <Link to="/auth/get-started">
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        borderRadius: theme.customShape.btn,
                                                        color: theme.palette.customColors.white,
                                                        fontWeight: theme.fontWeight.bold,
                                                    }}
                                                >
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </Box>
                            </Box>

                            {/* Responsive Navbar */}
                            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
                                <Button
                                    aria-controls="mobile-menu"
                                    aria-haspopup="true"
                                    onClick={handleMenuOpen}
                                    color="inherit"
                                    sx={buttonStyle}
                                >
                                    <MenuOpenIcon fontSize="large" color="primary" />
                                </Button>

                                <Menu
                                    id="mobile-menu"
                                    anchorEl={navbarAnchorEl}
                                    open={openNavbarMenu}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                    sx={{
                                        "& .MuiPaper-root": {
                                            borderRadius: theme.customShape.input,
                                            boxShadow: theme.shadows.default,
                                            border: `1px solid ${theme.palette.text.light}`,
                                        },
                                    }}
                                >
                                    <MenuItem onClick={handleMenuClose}>
                                        <Link to="/price">
                                            <Button variant="text" sx={menuResItem}>
                                                Price
                                            </Button>
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose}>
                                        <Link to="/contactus">
                                            <Button variant="text" sx={menuResItem}>
                                                Contact Us
                                            </Button>
                                        </Link>
                                    </MenuItem>

                                    {!userInfo && (
                                        <>
                                            <MenuItem onClick={handleMenuClose}>
                                                <Link to="/auth/login">
                                                    <Button
                                                        variant="text"
                                                        sx={{
                                                            borderRadius: "0px",
                                                            backgroundColor: "inherit",
                                                            fontWeight: theme.fontWeight.bold,
                                                        }}
                                                    >
                                                        Sign In
                                                    </Button>
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={handleMenuClose}>
                                            <Link to="/auth/get-started">
                                                    <Button
                                                        variant="text"
                                                        sx={{
                                                            borderRadius: "0px",
                                                            backgroundColor: "inherit",
                                                            fontWeight: theme.fontWeight.bold,
                                                        }}
                                                    >
                                                        Sign Up
                                                    </Button>
                                                </Link>
                                            </MenuItem>
                                        </>
                                    )}
                                </Menu>

                                {institutionData && userInfo && (
                                    <>
                                        <Link>
                                            <Stack direction="row" alignItems="center">
                                                <Box
                                                    component="img"
                                                    src={profileImage}
                                                    alt="Profile Icon"
                                                    style={{ borderRadius: "50%", width: "32px", height: "32px" }}
                                                />
                                                <IconButton
                                                    onClick={handleMenuProfileClick}
                                                    size="small"
                                                    aria-controls={openProfileMenu ? "profile-menu" : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={openProfileMenu ? "true" : undefined}
                                                >
                                                    <ExpandMoreIcon />
                                                </IconButton>
                                            </Stack>
                                        </Link>

                                        {/* Dropdown Menu */}
                                        <Menu
                                            id="profile-menu"
                                            anchorEl={anchorEl}
                                            open={openProfileMenu}
                                            onClose={handleMenuCloseProfile}
                                            MenuListProps={{
                                                "aria-labelledby": "basic-button",
                                            }}
                                        >
                                            <MenuItem onClick={handleProfileMenuItemClick}>
                                                {userInfo?.firstName} {userInfo?.lastName}
                                            </MenuItem>
                                            <MenuItem onClick={handleProfileMenuItemClick}>
                                                {institutionData?.institutionName}
                                            </MenuItem>
                                        </Menu>
                                    </>
                                )}
                            </Box>
                        </Toolbar>
                    </LandingContainer>
                </AppBar>
            </Slide>

            {/* Alert Confirmation Dialog */}
            <AlertConfirmation
                open={alertOpen}
                title={alertTitle}
                message={alertMessage}
                onConfirm={handleConfirm}
                onClose={handleCancel}
                cancelText="Okay"
                confirmText="Logout"
                confirmButtonColor={theme.palette.customColors.red300}
                iconColor={theme.palette.customColors.orange400}
                iconBgColor={theme.palette.customColors.orange200}
            />
        </>
    );
};

export default Navbar;
// ============ Start Navbar ============