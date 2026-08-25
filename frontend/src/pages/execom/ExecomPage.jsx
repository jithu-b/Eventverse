import { useEffect, useState } from "react";
import { execomApi } from "../../api/execomApi.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../components/ui/Toast.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Loader from "../../components/ui/Loader.jsx";
import ImageCropModal from "../../components/shared/ImageCropModal.jsx";
import "./Execom.css";

const emptyForm = { name: "", position: "", year: "" };

export default function ExecomPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [addFile, setAddFile] = useState(null);
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editFile, setEditFile] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // { mode: "add" | "edit", src: objectUrl } or null when the crop modal is closed
  const [cropTarget, setCropTarget] = useState(null);

  async function loadMembers() {
    setLoading(true);
    try {
      const res = await execomApi.list();
      setMembers(res.data.members || []);
    } catch (err) {
      console.error("Failed to load execom members:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const formData = new FormData();
      formData.append("name", addForm.name);
      formData.append("position", addForm.position);
      formData.append("year", addForm.year);
      if (addFile) formData.append("photo", addFile);
      await execomApi.create(formData);
      showToast("Member added", "success");
      setAddForm(emptyForm);
      setAddFile(null);
      setShowAddForm(false);
      loadMembers();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to add member", "error");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setEditForm({ name: member.name, position: member.position, year: member.year || "" });
    setEditFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
    setEditFile(null);
  };

  const handleEditSubmit = async (e, memberId) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("position", editForm.position);
      formData.append("year", editForm.year);
      if (editFile) formData.append("photo", editFile);
      await execomApi.update(memberId, formData);
      showToast("Member updated", "success");
      cancelEdit();
      loadMembers();
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update member", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (memberId) => {
    try {
      await execomApi.remove(memberId);
      showToast("Member removed", "success");
      loadMembers();
    } catch (err) {
      showToast("Failed to remove member", "error");
    }
  };

  const handleAddFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCropTarget({ mode: "add", src: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handleEditFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCropTarget({ mode: "edit", src: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handleCropCancel = () => {
    setCropTarget(null);
  };

  const handleCropComplete = (croppedFile) => {
    if (cropTarget?.mode === "add") {
      setAddFile(croppedFile);
    } else if (cropTarget?.mode === "edit") {
      setEditFile(croppedFile);
    }
    setCropTarget(null);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="execom-page stagger-down">
      <div className="execom-header">
        <h1>Meet the Execom</h1>
        <p className="execom-subtitle">
          The team behind TinkerHub's events, workshops, and hackathons.
        </p>
        {isAdmin && (
          <Button
            variant="secondary"
            className="execom-add-toggle"
            onClick={() => setShowAddForm((v) => !v)}
          >
            {showAddForm ? "Cancel" : "+ Add Member"}
          </Button>
        )}
      </div>

      {isAdmin && showAddForm && (
        <Card className="execom-form-card">
          <h2>Add a member</h2>
          <form className="auth-form" onSubmit={handleAddSubmit}>
            <Input
              label="Name"
              value={addForm.name}
              onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              label="Position"
              value={addForm.position}
              onChange={(e) => setAddForm((f) => ({ ...f, position: e.target.value }))}
              required
            />
            <Input
              label="Year"
              placeholder="e.g. 3rd Year"
              value={addForm.year}
              onChange={(e) => setAddForm((f) => ({ ...f, year: e.target.value }))}
            />
            <label className="execom-file-label">
              Choose Photo
              <input
                type="file"
                accept="image/*"
                className="execom-file-input"
                onChange={handleAddFileSelected}
              />
            </label>
            {addFile && <p className="execom-file-name">{addFile.name}</p>}
            <Button type="submit" loading={adding} fullWidth>
              Add Member
            </Button>
          </form>
        </Card>
      )}

      {members.length === 0 ? (
        <Card className="execom-empty-card">
          <p>No execom members added yet.</p>
        </Card>
      ) : (
        <div className="execom-grid">
          {members.map((member) =>
            editingId === member.id ? (
              <Card key={member.id} className="execom-card execom-card-editing">
                <form onSubmit={(e) => handleEditSubmit(e, member.id)}>
                  <Input
                    label="Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                  <Input
                    label="Position"
                    value={editForm.position}
                    onChange={(e) => setEditForm((f) => ({ ...f, position: e.target.value }))}
                    required
                  />
                  <Input
                    label="Year"
                    value={editForm.year}
                    onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))}
                  />
                  <label className="execom-file-label">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="execom-file-input"
                      onChange={handleEditFileSelected}
                    />
                  </label>
                  {editFile && <p className="execom-file-name">{editFile.name}</p>}
                  <div className="execom-edit-actions">
                    <Button type="submit" loading={savingEdit}>Save</Button>
                    <Button type="button" variant="secondary" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </form>
              </Card>
            ) : (
              <Card key={member.id} className="execom-card">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} className="execom-photo" />
                ) : (
                  <div className="execom-avatar">{member.name.charAt(0)}</div>
                )}
                <h2>{member.name}</h2>
                <p className="execom-position">{member.position}</p>
                {member.year && <p className="execom-year">{member.year}</p>}
                {isAdmin && (
                  <div className="execom-card-actions">
                    <Button variant="secondary" onClick={() => startEdit(member)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(member.id)}>Remove</Button>
                  </div>
                )}
              </Card>
            )
          )}
        </div>
      )}

      {cropTarget && (
        <ImageCropModal
          imageSrc={cropTarget.src}
          aspect={1}
          fileName="execom-photo.jpg"
          onCancel={handleCropCancel}
          onComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
