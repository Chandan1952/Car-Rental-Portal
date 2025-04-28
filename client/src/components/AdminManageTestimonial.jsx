import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Chip,
  Avatar,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pending as PendingIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { green, red, orange, blue } from "@mui/material/colors";

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://car-rental-portal-backend.onrender.com/api/admin/testimonials",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch testimonials");

      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      setError("Error fetching testimonials. Please try again later.");
      showSnackbar("Error fetching testimonials", "error");
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentApproved) => {
    setUpdatingId(id);
    try {
      const newApproved = !currentApproved;

      const response = await fetch(
        `https://car-rental-portal-backend.onrender.com/api/admin/testimonials/${id}/approve`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved: newApproved }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update status: ${errorText}`);
      }

      setTestimonials((prev) =>
        prev.map((testimonial) =>
          testimonial._id === id
            ? { ...testimonial, approved: newApproved }
            : testimonial
        )
      );
      showSnackbar(
        `Testimonial ${newApproved ? "approved" : "disapproved"} successfully`,
        "success"
      );
    } catch (error) {
      console.error("Error updating status:", error);
      showSnackbar("Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTestimonial) return;
    
    try {
      const response = await fetch(
        `https://car-rental-portal-backend.onrender.com/api/admin/testimonials/${selectedTestimonial._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete testimonial");

      setTestimonials((prev) =>
        prev.filter((t) => t._id !== selectedTestimonial._id)
      );
      showSnackbar("Testimonial deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      showSnackbar("Failed to delete testimonial", "error");
    } finally {
      setDialogOpen(false);
      setSelectedTestimonial(null);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Testimonials Management
          </Typography>

          {loading ? (
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
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : testimonials.length > 0 ? (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table sx={{ minWidth: 650 }} aria-label="testimonials table">
                <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Testimonial</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testimonials.map((item, index) => (
                    <TableRow
                      key={item._id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ bgcolor: blue[500], mr: 2 }}>
                            {item.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <EmailIcon
                                fontSize="small"
                                sx={{ mr: 0.5, fontSize: "16px" }}
                              />
                              {item.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "300px",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.testimonial}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<CalendarIcon fontSize="small" />}
                          label={new Date(item.date).toLocaleDateString()}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            item.approved ? (
                              <CheckCircleIcon fontSize="small" />
                            ) : (
                              <PendingIcon fontSize="small" />
                            )
                          }
                          label={item.approved ? "Approved" : "Pending"}
                          color={item.approved ? "success" : "warning"}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            variant="contained"
                            size="small"
                            color={item.approved ? "error" : "success"}
                            startIcon={
                              item.approved ? <CancelIcon /> : <CheckCircleIcon />
                            }
                            onClick={() => toggleStatus(item._id, item.approved)}
                            disabled={updatingId === item._id}
                            sx={{ mr: 1 }}
                          >
                            {updatingId === item._id
                              ? "Processing..."
                              : item.approved
                              ? "Disapprove"
                              : "Approve"}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(item)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
                backgroundColor: "#fafafa",
                borderRadius: 2,
              }}
            >
              <PendingIcon
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No testimonials available
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                When testimonials are submitted, they will appear here
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the testimonial from{" "}
            <strong>{selectedTestimonial?.name}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
