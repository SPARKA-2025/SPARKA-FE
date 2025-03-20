import Actionbar from "@/app/_components/Actionbar";
import ButtonIcon from "@/app/_components/ButtonIcon";
import { Box, Button, TextField } from "@mui/material";

export default function Order({}) {
  return (
    <div className="fixed">
      <Actionbar title={"Tambah Jadwal"} />

      <Box
        component="form"
        // sx={{
        //   "& > :not(style)": { m: 1, width: "25ch" },
        // }}
        noValidate
        autoComplete="off"
        className="w-screen h-screen inline-flex py-40 justify-center bg-white flex-col"
      >
        <div className="justify-around flex flex-wrap h-[72%] px-12">
          <TextField
            id="plat"
            label="Nomor Plat"
            variant="outlined"
            className="w-full"
            color="primary"
            required
          />
          <TextField
            id="plat"
            label="Nama Pemesan"
            variant="outlined"
            className="w-full"
            color="primary"
            required
          />
          <TextField
            id="plat"
            label="Jenis Mobil"
            variant="outlined"
            className="w-full"
            color="primary"
            required
          />
          <TextField
            id="plat"
            label="Pilih Waktu"
            variant="outlined"
            className="w-full"
            color="primary"
            required
          />
          <Button variant="contained" color="primary" className="bg-primary w-full h-[12%]" href={'/transaksi/detail/id'}>Simpan</Button>
        </div>
      </Box>
    </div>
  );
}
