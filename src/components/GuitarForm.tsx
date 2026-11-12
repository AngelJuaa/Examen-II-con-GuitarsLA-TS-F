import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createGuitar } from "../api/guitars";

type Props = { onCreated: () => void };
type Errors = Partial<Record<keyof GuitarInput, string>>;

const IMAGES = Array.from(
  { length: 12 },
  (_, i) => `guitarra_${String(i + 1).padStart(2, "0")}`,
);

const emptyForm = {
  brand: "",
  name: "",
  description: "",
  price: "",
  image: "",
};

function validate(form: typeof emptyForm): Errors {
  const errors: Errors = {};
  if (!form.brand.trim()) errors.brand = "La marca es obligatoria";
  if (!form.name.trim()) errors.name = "El modelo es obligatorio";
  if (!form.description.trim())
    errors.description = "La descripción es obligatoria";
  if (!form.image) errors.image = "Selecciona una imagen";

  if (form.price.trim() === "") {
    errors.price = "El precio es obligatorio";
  } else if (Number.isNaN(Number(form.price))) {
    errors.price = "El precio debe ser un número";
  } else if (Number(form.price) <= 0) {
    errors.price = "El precio debe ser mayor a 0";
  }
  return errors;
}

export default function GuitarForm({ onCreated }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await createGuitar({
        brand: form.brand.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        image: form.image,
      });
      setForm(emptyForm);
      onCreated();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "No se pudo guardar la guitarra",
      );
    } finally {
      setSaving(false);
    }
  }

  const cls = (field: keyof GuitarInput) =>
    `form-control ${errors[field] ? "is-invalid" : ""}`;

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center p-3">
      <form
        className="mx-auto w-100 guitar-form bg-white border rounded-4 shadow p-4 p-md-5"
        style={{ maxWidth: 640 }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-center fw-bold mb-4">Agregar Guitarra</h2>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <div className="mb-3">
          <label htmlFor="brand" className="form-label fw-semibold">
            Marca
          </label>
          <input
            id="brand"
            name="brand"
            className={`${cls("brand")} rounded-3`}
            value={form.brand}
            onChange={handleChange}
            maxLength={100}
          />
          {errors.brand && (
            <div className="invalid-feedback">{errors.brand}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-semibold">
            Modelo
          </label>
          <input
            id="name"
            name="name"
            className={`${cls("name")} rounded-3`}
            value={form.name}
            onChange={handleChange}
            maxLength={100}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-semibold">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className={`${cls("description")} rounded-3`}
            value={form.description}
            onChange={handleChange}
            maxLength={500}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label fw-semibold">
            Precio (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            className={`${cls("price")} rounded-3`}
            value={form.price}
            onChange={handleChange}
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label fw-semibold">
            Imagen
          </label>
          <select
            id="image"
            name="image"
            className={`form-select rounded-3 ${errors.image ? "is-invalid" : ""}`}
            value={form.image}
            onChange={handleChange}
          >
            <option value="">-- Selecciona --</option>
            {IMAGES.map((img) => (
              <option key={img} value={img}>
                {img}
              </option>
            ))}
          </select>
          {errors.image && (
            <div className="invalid-feedback">{errors.image}</div>
          )}
          {form.image && (
            <img
              src={`/img/${form.image}.jpg`}
              alt="vista previa"
              className="img-fluid mt-3 rounded-3 border shadow-sm"
              style={{ maxHeight: 160, objectFit: "cover" }}
            />
          )}
        </div>

        <button
          type="submit"
          className="btn btn-dark btn-lg w-100 rounded-3 fw-semibold shadow-sm"
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar guitarra"}
        </button>
      </form>
    </div>
  );
}
