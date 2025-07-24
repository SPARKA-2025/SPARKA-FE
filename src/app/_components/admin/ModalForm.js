'use client';

import { Button, Modal, Box, TextField } from "@mui/material";
import { useEffect } from "react";

export default function ModalForm({
  open,
  onClose,
  title,
  fields = [],
  values = {},
  onSubmit,
  onDelete,
  onFieldChange,
  onFileChange
}) {


  

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={onSubmit}
        className="w-full max-w-lg bg-white m-auto mt-24 p-8 rounded-lg shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
        {fields.map((field, index) => (
          <div key={index}>
            {field.type === "file" ? (
              <input
                type="file"
                name={field.name}
                accept={field.accept || "*"}
                onChange={onFileChange}
                required={field.required}
                className="w-full border rounded p-2"
              />
            ) : (
              <TextField
                id={field.name}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type || "text"}
                value={values[field.name]}
                onChange={onFieldChange}
                required={field.required}
                multiline={field.multiline}
                rows={field.rows || 1}
                fullWidth
              />
            )}
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
