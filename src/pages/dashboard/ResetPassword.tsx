import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBarProps";
import { ActionButtons } from "@/components/ActionButton";
import { TableFooter } from "@/components/TableFooter";
import { Alert } from "@/components/Alert";
import { Konfirmasi } from "@/components/Konfirmasi";
import { Badge } from "@/components/ui/badge";
import { KeyRound, ShieldCheck, ShieldAlert, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function ResetPasswordPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const API_URL = import.meta.env.VITE_API_URL;
  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [resetDialog, setResetDialog] = useState<{
    userId: string;
    userName: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const mapApiData = (item: any): User => ({
    id: item.id.toString(),
    username: item.username || "",
    email: item.email || "",
    role: item.role || "user",
    status: item.status || "pending",
    createdAt: item.created_at || item.createdAt || "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/users`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const raw = await res.json();
      // Filter hanya user yang sudah approved
      const approvedUsers = raw.filter((user: any) => user.status === "approved");
      const mapped = approvedUsers.map(mapApiData);
      setUsers(mapped);
    } catch (err: any) {
      console.error("Failed to load users:", err);
      setAlert({
        variant: "error",
        title: "Error",
        message: err.message || "Failed to load users data",
      });
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOpenResetDialog = (userId: string, userName: string) => {
    setResetDialog({ userId, userName });
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCloseResetDialog = () => {
    // Don't close if confirmation dialog is showing
    if (showConfirm) return;
    
    setResetDialog(null);
    setNewPassword("");
    setConfirmPassword("");
    setShowConfirm(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsResetting(false);
  };

  const validatePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "Password minimal 6 karakter",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "Password tidak cocok",
      });
      return false;
    }

    return true;
  };

  const handleResetPassword = () => {
    if (!validatePassword()) return;
    setShowConfirm(true);
  };

  const confirmResetPassword = async () => {
    if (!resetDialog) return;

    try {
      setIsResetting(true);
      setShowConfirm(false);
      
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: resetDialog.userId,
          newPassword: newPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to reset password");
      }

      await res.json();

      setAlert({
        variant: "success",
        title: "Berhasil",
        message: `Password untuk ${resetDialog.userName} berhasil direset!`,
      });

      // Close dialog properly
      setResetDialog(null);
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setIsResetting(false);
      
      // Refresh users
      fetchUsers();
    } catch (err: any) {
      setAlert({
        variant: "error",
        title: "Gagal",
        message: err.message || "Gagal mereset password",
      });
      setIsResetting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <ShieldAlert className="w-3 h-3 mr-1" />
            User
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Reset Password User</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          <ActionButtons
            onRefresh={fetchUsers}
            loading={loading}
            actions={[]}
          />
        </div>

        {alert && (
          <div className="mb-4">
            <Alert
              variant={alert.variant}
              title={alert.title}
              duration={5000}
              onClose={() => setAlert(null)}
            >
              {alert.message}
            </Alert>
          </div>
        )}

        {showConfirm && (
          <Konfirmasi
            title="Konfirmasi Reset Password"
            message={`Apakah Anda yakin ingin mereset password untuk "${resetDialog?.userName}"?`}
            onConfirm={confirmResetPassword}
            onCancel={() => setShowConfirm(false)}
          />
        )}

        {/* Reset Password Dialog */}
        <Dialog 
          open={!!resetDialog} 
          onOpenChange={(open) => {
            if (!open && !showConfirm) {
              handleCloseResetDialog();
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Reset password untuk pengguna: <strong>{resetDialog?.userName}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Masukkan password baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Minimal 6 karakter</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCloseResetDialog}
                disabled={isResetting}
              >
                Batal
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={isResetting || !newPassword || !confirmPassword}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <KeyRound className={`w-4 h-4 mr-2 ${isResetting ? "animate-spin" : ""}`} />
                {isResetting ? "Mereset..." : "Reset Password"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Table */}
        <div className="bg-white border rounded-lg shadow-sm mb-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tanggal Daftar</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleOpenResetDialog(user.id, user.username)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <KeyRound className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Reset</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <TableFooter
          total={users.length}
          filtered={filteredUsers.length}
          perPage={perPage}
          onPerPageChange={setPerPage}
        />
      </div>
    </DashboardLayout>
  );
}
