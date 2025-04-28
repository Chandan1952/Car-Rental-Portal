import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

const AdminManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vehiclesdetails");
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        setError(err.message);
        showSnackbar("Error fetching vehicles", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/delete/${vehicleToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete vehicle");
      setVehicles((prev) =>
        prev.filter((vehicle) => vehicle._id !== vehicleToDelete._id)
      );
      showSnackbar("Vehicle deleted successfully", "success");
    } catch (err) {
      showSnackbar("Error deleting vehicle: " + err.message, "error");
    } finally {
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleEditClick = (vehicleId) => {
    navigate(`/admin/edit-vehicle/${vehicleId}`);
  };

  const handleAddNew = () => {
    navigate("/admin/add-vehicle");
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredVehicles = vehicles.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  const fuelTypeColors = {
    Petrol: "#FF5722",
    Diesel: "#795548",
    Electric: "#4CAF50",
    Hybrid: "#8BC34A",
    CNG: "#607D8B",
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminHeader />
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: "240px",
          marginTop: "64px",
          backgroundColor: "#f5f5f5",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h1" fontWeight="bold">
              Vehicle Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
            >
              Add New Vehicle
            </Button>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search vehicles by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ mb: 3 }}
          />

          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                backgroundColor: "#ffeeee",
                borderRadius: 1,
                color: "error.main",
              }}
            >
              <ErrorIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Error Loading Vehicles
              </Typography>
              <Typography>{error}</Typography>
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </Box>
          )}

          {!loading && !error && (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table sx={{ minWidth: 650 }} aria-label="vehicles table">
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Vehicle</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Price/Day</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Fuel Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Year</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle, index) => (
                      <TableRow
                        key={vehicle._id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">
                            {vehicle.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={vehicle.brand}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography color="primary" fontWeight="bold">
                            ₹{vehicle.pricePerDay.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={vehicle.fuelType}
                            size="small"
                            sx={{
                              backgroundColor: fuelTypeColors[vehicle.fuelType]
                                ? `${fuelTypeColors[vehicle.fuelType]}20`
                                : "#e0e0e0",
                              color: fuelTypeColors[vehicle.fuelType] || "#000",
                              borderColor: fuelTypeColors[vehicle.fuelType],
                            }}
                          />
                        </TableCell>
                        <TableCell>{vehicle.modelYear}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(vehicle._id)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(vehicle)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <SearchIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            No vehicles found
                          </Typography>
                          <Typography color="text.secondary">
                            Try adjusting your search query
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{vehicleToDelete?.title}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          icon={
            snackbar.severity === "success" ? <CheckCircleIcon /> : <ErrorIcon />
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminManageVehicles;