# BACKEND SPARKA
#### API SPARKA

# Register User Endpoints
   * Method:
        - POST
   * Endpoint:
        - /api/register
   * Request Body:
        - `nama` as `string`: Nama dari user
        - `email` as `string`: Email dari user
        - `password` as `string`: Password dari user
        - `alamat` as `string`: Alamat dari user
        - `phone` as `string`: Nomor telepon dari user
   * Example:
        - Endpoint:
        
                /api/register
        - Insert:
        
                nama: Akmal
                email: akmal@gmail.com
                password: akmal12345
                alamat: Jakarta
                phone: 085382048613
   * Result:
   
            {
                "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL3JlZ2lzdGVyIiwiaWF0IjoxNzE2MjgzNjc1LCJleHAiOjE3MTYyODcyNzUsIm5iZiI6MTcxNjI4MzY3NSwianRpIjoiM2hoQ1B6VWluaXVmTEVnMSIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.8HnEMq6cDmtnpI4Z8sq9VZVohkVFjtIglKBPYeKcjxM",
                "token_type": "bearer",
                "expires_in": 3600
            }
        
# Login User Endpoints
   * Method:
        - POST
   * Endpoint:
        - /api/login
   * Request Body:
        - `email` as `string`: Email user yang sudah di register
        - `password` as `string`: Password user yang sudah di register
   * Example:
        - Endpoint:
        
                /api/login
        - Insert:
        
                email: akmal@gmail.com
                password: akmal12345
   * Result:
        
            {
                "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzE2Mjg0MDcwLCJleHAiOjE3MTYyODc2NzAsIm5iZiI6MTcxNjI4NDA3MCwianRpIjoibHJpZ1VKcjd6TzRoY1hENCIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.sIGiu1pALUT-jV0epBMRigstcaWXKfGwWNIi8mdVXdo",
                "token_type": "bearer",
                "expires_in": 3600
            }
            
# Logout User Endpoint
   * Method:
        - POST
   * Endpoint:
        /api/logout
   * Request Body:
        - token bearer hasil dari login dimasukkan ke authorization, pilih auth type bearer token, lalu masukkan tokennya ke kolom token, kemudian klik send
   * Result:
        
            {
                "message": "Successfully logged out"
            }
            
# Eksklusif User
**NB: Eksklusif user diperuntukkan untuk user khusus yang memerlukan token access dengan masa aktif lama untuk mengakses API yang dituju secara real-time.**
## 1. Register
   * Method:
       - POST
   * Endpoint:
       - /api/register-eksklusif
   * Request Body:
        - `nama` as `string`: Nama dari eksklusif user
        - `email` as `string`: Email dari eksklusif user
        - `password` as `string`: Password dari eksklusif user
        - `alamat` as `string`: Alamat dari eksklusif user
        - `phone` as `string`: Nomor telepon dari eksklusif user
   * Example:
        - Endpoint:
        
                /api/register-eksklusif
        - Insert:
        
                Nama: Nurul
                email: nurul@gmail.com
                password: nurul12345
                alamat: Magelang
                phone: 087836401490
   * Result:
        
            {
                "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luLWVrc2tsdXNpZiIsImlhdCI6MTcyMDU5Nzk4NywiZXhwIjoyMDM1OTU3OTg3LCJuYmYiOjE3MjA1OTc5ODcsImp0aSI6IkJFaVhvbGtqdFVKZEJIbHkiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.zH3L1sevaSrMe6db8_vd_tbxZPG4OnNbnAiSJQyPwzQ",
                "token_type": "bearer",
                "expires_in": 315360000
            }
   * Response:
        
            200: Data berhasil ditambahkan

## 2. Login
   * Method:
       - POST
   * Endpoint:
       - /api/login-eksklusif
   * Request Body:
       - `email` as `string`: Email dari eksklusif user
       - `password` as `string`: Password dari eksklusif user
   * Example:
        - Endpoint:
        
                /api/login-eksklusif
        - Insert:
        
                email: Nurul
                password: nurul12345
   * Result:
        
            {
                "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luLWVrc2tsdXNpZiIsImlhdCI6MTcyMDU5Nzk4NywiZXhwIjoyMDM1OTU3OTg3LCJuYmYiOjE3MjA1OTc5ODcsImp0aSI6IkJFaVhvbGtqdFVKZEJIbHkiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.zH3L1sevaSrMe6db8_vd_tbxZPG4OnNbnAiSJQyPwzQ",
                "token_type": "bearer",
                "expires_in": 315360000
            }
   * Response:
        
            200: Data berhasil ditambahkan

# Fakultas Endpoints
## 1. Insert Fakultas
   * Method:
        - POST
   * Endpoint:
        - /api/fakultas
   * Request Body:
        - `name` as `string`: Nama dari fakultas
        - `longitude` as `string`: Koordinat sumbu X
        - `latitude` as `string`: Koodinat sumbu Y
   * Example:
   
        {
        
            "id": 1,
            "nama": "Fakultas Ilmu Pendidikan dan Psikologi",
            "longitude": "110.396866941956",
            "latitude": "-7.048236137420003",
        
        }
   * Response:
        
            200: Data berhasil ditambahkan
            400: Data gagal ditambahkan

## 2. Update Fakultas Data
   * Method:
        - PUT
   * Endpoint:
        - /api/fakultas/{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari fakultas
        - `name` as `string`: Nama dari fakultas
        - `longitude` as `string`: Koordinat sumbu X
        - `latitude` as `string`: Koodinat sumbu Y 
   * Response:
            200: Data sudah diupdate
            
## 3. Delete Fakultas Data
   * Method:
        - DELETE
   * Endpoint:
        - /fakultas{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari fakultas
   * Response:
            200: Data sudah dihapus
            
## 4. Get All Fakultas Data
   * Method:
        - GET
   * Endpoint:
        - /api/fakultas
   * Parameter:
        - All: Menampilkan semua atribut yang berada di dalam fakultas
   * Example:
        
            "status": 200,
            "pesan": "Data Berhasil Ditampilkan",
            "data": [
                {
                    "id": 1,
                    "nama": "Fakultas Teknik",
                    "longitude": "110.396866941956",
                    "latitude": "-7.048236137420003",
                    "created_at": "2024-05-20T08:00:24.000000Z",
                    "updated_at": "2024-05-20T08:09:21.000000Z"
                },
                {
                    "id": 2,
                    "nama": "Fakultas Keolahragaan",
                    "longitude": "110.396866941956",
                    "latitude": "-7.048236137420003",
                    "created_at": "2024-05-20T08:23:10.000000Z",
                    "updated_at": "2024-05-20T08:23:10.000000Z"
                }
            ]
    
   * Response:
            200 OK: Data Berhasil Ditampilkan
            400 Bad Request: Data Gagal Ditampilkan
        
## 5. Get Fakultas Data Detail
   * Method:
        - GET
   * Endpoint:
        - /api/fakultas/{id}
   * Parameter:
        - `id` as `bigIncrements`: id dari fakultas
   * Example to Get Fakultas Data Detail:
   
            /api/fakultas/1
   * Response:
   
            200 OK
            
            {
                "id": 1,
                "nama": "Fakultas Kependidikan",
                "longitude": "110.396866941956",
                "latitude": "-7.048236137420003",
            }
            
# Blok Endpoint
## 1. Insert Blok Data
   * Method:
       - POST
   * Endpoint:
       - /api/blok
   * Request Body:
       - `id_fakultas` as `unsignedBigInteger`: Foreign id dari fakultas
       - `nama` as `string`: Nama dari Blok
       - `longitude` as `string`: Koordinat sumbu X
       - `latitude` as `string`: Koordinat sumbu Y
   * Example:
   
            {
                "status": 200,
                "pesan": "Data Berhasil Ditambahkan",
                "data": {
                "nama": "Blok 3",
                "id_fakultas": "9",
                "longitude": "110.396866941956",
                "latitude": "-7.048236137420003"
            }
   * Response:
        - 200 OK: Data berhasil ditambahkan
        - 400 Bad Request: Data gagal ditambahkan
            
## 2. Update Blok Data
   * Method:
        - PUT
   * Endpoint:
        - /api/blok/{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari blok
        - `id_fakultas` as `unsignedBigInteger`: Foreign id dari fakultas
        - `nama` as `string`: Nama dari blok
        - `longitude` as `string`: Koordinat sumbu X
        - `latitude` as `string`: Koodinat sumbu Y 
   * Response:
            200: Data sudah diupdate
            
## 3. Delete Blok Data
   * Method:
        - DELETE
   * Endpoint:
        - /api/blok{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari blok
   * Response:
            200: Data sudah dihapus
            
## 4. Get All Blok Data
   * Method:
        - GET
   * Endpoint:
        - /api/blok
   * Parameter:
        - All: Menampilkan semua atribut yang berada di dalam blok
   * Example:
   
            {
                "id": 1,
                "id_fakultas": 1,
                "nama": "Blok 1",
                "longitude": "110.396866941956",
                "latitude": "-7.048236137420003",
                "created_at": "2024-05-20T09:33:33.000000Z",
                "updated_at": "2024-05-20T09:33:33.000000Z",
                "fakultas": {
                    "id": 1,
                    "nama": "Fakultas Teknik",
                    "longitude": "110.396866941956",
                    "latitude": "-7.048236137420003",
                    "created_at": "2024-05-20T08:00:24.000000Z",
                    "updated_at": "2024-05-20T08:09:21.000000Z"
                }
            },
            {
                "id": 2,
                "id_fakultas": 1,
                "nama": "Blok 2",
                "longitude": "110.396866941956",
                "latitude": "-7.048236137420003",
                "created_at": "2024-05-20T09:35:57.000000Z",
                "updated_at": "2024-05-20T09:35:57.000000Z",
                "fakultas": {
                    "id": 1,
                    "nama": "Fakultas Teknik",
                    "longitude": "110.396866941956",
                    "latitude": "-7.048236137420003",
                    "created_at": "2024-05-20T08:00:24.000000Z",
                    "updated_at": "2024-05-20T08:09:21.000000Z"
                }
            }
   * Response:
            200 OK: Data Berhasil Ditampilkan
            400 Bad Request: Data Gagal Ditampilkan
            
## 5. Get Blok Data Detail
   * Method:
        - GET
   * Endpoint:
        - /api/blok/{id}
   * Parameter:
        - `id` as `bigIncrements`: id dari blok
   * Example Endpoint to Get Fakultas Data Detail:
   
            /api/blok/1
   * Response:
   
            200 OK
            
            {
                "id": 5,
                "id_fakultas": 3,
                "nama": "Blok 1",
                "longitude": "110.396866941956",
                "latitude": "-7.048236137420003",
                "created_at": "2024-04-26T02:25:44.000000Z",
                "updated_at": "2024-04-26T02:25:44.000000Z"
            }
            
# Slot Parkir Endpoint
## 1. Insert Slot Parkir Data
   * Method:
       - POST
   * Endpoint:
       - /api/slot-parkir
   * Request Body:
       - `id_blok` as `unsignedBigInteger`: Foreign id dari blok
       - `slot_name` as `string`: Slot Nama dari tempat parkir
       - `status` as `string`: Kondisi status dari slot name dengan default kosong
       - `x` as `string`: Koordinat sumbu X
       - `y` as `string`: Koordinat sumbu Y
   * Example:
   
            {
                "status": 200,
                "pesan": "Data Berhasil Ditambahkan",
                "data": {
                    "slot_name": "1",
                    "status": "Terisi",
                    "x": "2.143",
                    "y": "-42.145",
                    "id_blok": "1"
                }
            }
   * Response:
        - 200 OK: Data berhasil ditambahkan
        - 400 Bad Request: Data gagal ditambahkan
            
## 2. Update Slot Parkir Data
   * Method:
        - PUT
   * Endpoint:
        - /api/slot-parkir/{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari slot parkir
        - `id_blok` as `unsignedBigInteger`: Foreign id dari blok
        - `slot_name` as `string`: Slot Nama dari tempat parkir
        - `status` as `string`: Kondisi status dari slot name dengan default kosong
        - `x` as `string`: Koordinat sumbu X
        - `y` as `string`: Koordinat sumbu Y
   * Response:
            200: Data sudah diupdate
            
## 3. Delete Slot Parkir Data
   * Method:
        - DELETE
   * Endpoint:
        - /api/slot-parkir/{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari slot parkir
   * Response:
            200: Data sudah dihapus
            
## 4. Get All Slot Parkir Data
   * Method:
        - GET
   * Endpoint:
        - /api/slot-parkir
   * Parameter:
        - All: Menampilkan semua atribut yang berada di dalam slot parkir
   * Example:
        
            {
                "total_slot": 17,
                "slot_kosong": "8/17"
            }
   * Response:
            200 OK: Data Berhasil Ditampilkan
            400 Bad Request: Data Gagal Ditampilkan
            
## 5. Get Slot Parkir Data Detail
   * Method:
        - GET
   * Endpoint:
        - /api/slot-parkir/{id}
   * Parameter:
        - `id` as `bigIncrements`: id dari slot parkir
   * Example Endpoint to Get Slot Parkir Data Detail:
   
            /api/slot-parkir/2
   * Response:
   
            200 OK
            
            {
                "id": 2,
                "id_blok": 1,
                "slot_name": 3,
                "status": "Kosong",
                "x": "2.143",
                "y": "-42.145",
                "created_at": "2024-04-26T03:36:17.000000Z",
                "updated_at": "2024-04-26T03:36:17.000000Z"
            }
            
# Parkir Endpoint
## 1. Insert Parkir Data
   * Method:
       - POST
   * Endpoint:
       - /api/parkir
   * Request Body:
       - `id_slot` as `unsignedBigInteger`: Foreign id dari slot parkir
       - `plat_nomor` as `string`: Plat nomor kendaraan
       - `nama_pemesan` as `string`: Nama pemesan tempat parkir
       - `jenis_mobil` as `string`: Jenis mobil dari pemesan
       - `tanggal_masuk` as `date`: Tanggal masuk pemesan memulai parkir
       - `tanggal_keluar` as `date`: Tanggal keluar pemesan selesai parkir
   * Example:
   
            {
                "pesan": "Data Berhasil Ditambahkan",
                "data": {
                    "plat_nomor": "K 1234 AHC",
                    "nama_pemesan": "Mark",
                    "jenis_mobil": "Kijang",
                    "tanggal_masuk": "2024-04-26 09:56:56",
                    "tanggal_keluar": "2024-04-26 12:56:56",
                    "id_slot": "2"
                }
            }
   * Response:
        - 200 OK: Data berhasil ditambahkan
        - 400 Bad Request: Data gagal ditambahkan
            
## 2. Update Parkir Data
   * Method:
        - PUT
   * Endpoint:
        - /api/parkir/{id}
   * Request Body:
        - `id_slot` as `unsignedBigInteger`: Foreign id dari slot parkir
        - `plat_nomor` as `string`: Plat nomor kendaraan
        - `nama_pemesan` as `string`: Nama pemesan tempat parkir
        - `jenis_mobil` as `string`: Jenis mobil dari pemesan
        - `tanggal_masuk` as `date`: Tanggal masuk pemesan memulai parkir
        - `tanggal_keluar` as `date`: Tanggal keluar pemesan selesai parkir
   * Response:
            200: Data sudah diupdate
            
## 3. Delete Parkir Data
   * Method:
        - DELETE
   * Endpoint:
        - /api/parkir/{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari parkir
   * Response:
            200: Data sudah dihapus
            
## 4. Get All Parkir Data
   * Method:
        - GET
   * Endpoint:
        - /api/parkir
   * Parameter:
        - All: Menampilkan semua atribut yang berada di dalam parkir
   * Example:
   
           {
                "id": 1,
                "id_slot": 1,
                "plat_nomor": "K 8410 AHC",
                "nama_pemesan": "Mark",
                "jenis_mobil": "Kijang",
                "tanggal_masuk": "2024-04-26 09:56:56",
                "tanggal_keluar": "2024-04-26 12:56:56",
                "created_at": "2024-05-20T11:39:41.000000Z",
                "updated_at": "2024-05-20T11:39:41.000000Z",
                "slot__parkir": {
                    "id": 1,
                    "id_blok": 1,
                    "slot_name": 1,
                    "status": "Terisi",
                    "x": "6487",
                    "y": "2948",
                    "created_at": "2024-05-20T11:33:38.000000Z",
                    "updated_at": "2024-05-20T11:39:41.000000Z",
                    "blok": {
                        "id": 1,
                        "id_fakultas": 1,
                        "nama": "Blok 1",
                        "longitude": "110.396866941956",
                        "latitude": "-7.048236137420003",
                        "created_at": "2024-05-20T11:29:42.000000Z",
                        "updated_at": "2024-05-20T11:29:42.000000Z",
                        "fakultas": {
                            "id": 1,
                            "nama": "Fakultas Ilmu Pendidikan dan Psikologi",
                            "longitude": "110.396866941956",
                            "latitude": "-7.048236137420003",
                            "created_at": "2024-05-20T11:29:07.000000Z",
                            "updated_at": "2024-05-20T11:29:07.000000Z"
                        }
                    }
                }
            },
            {
                "id": 2,
                "id_slot": 8,
                "plat_nomor": "K 2740 AC",
                "nama_pemesan": "Rey",
                "jenis_mobil": "Avanza",
                "tanggal_masuk": "2024-04-26 08:56:56",
                "tanggal_keluar": "2024-04-26 12:56:56",
                "created_at": "2024-05-20T11:42:05.000000Z",
                "updated_at": "2024-05-20T11:42:05.000000Z",
                "slot__parkir": {
                    "id": 8,
                    "id_blok": 3,
                    "slot_name": 2,
                    "status": "Terisi",
                    "x": "3222",
                    "y": "7059",
                    "created_at": "2024-05-20T11:34:20.000000Z",
                    "updated_at": "2024-05-20T11:42:05.000000Z",
                    "blok": {
                        "id": 3,
                        "id_fakultas": 2,
                        "nama": "Blok 1",
                        "longitude": "110.396866941956",
                        "latitude": "-7.048236137420003",
                        "created_at": "2024-05-20T11:29:42.000000Z",
                        "updated_at": "2024-05-20T11:29:42.000000Z",
                        "fakultas": {
                            "id": 2,
                            "nama": "Fakultas Matematika & Ilmu Pengetahuan Alam",
                            "longitude": "110.39359139844254",
                            "latitude": "-7.050501773849033",
                            "created_at": "2024-05-20T11:29:07.000000Z",
                            "updated_at": "2024-05-20T11:29:07.000000Z"
                        }
                    }
                }
            }
   * Response:
            200 OK: Data Berhasil Ditampilkan
            400 Bad Request: Data Gagal Ditampilkan
            
## 5. Get Parkir Data Detail
   * Method:
        - GET
   * Endpoint:
        - /api/parkir/{id}
   * Parameter:
        - `id` as `bigIncrements`: id dari parkir
   * Example Endpoint to Get parkir Data Detail:
   
            /api/parkir/1
   * Response:
   
            200 OK
            
            {
                "id": 1,
                "id_slot": 2,
                "plat_nomor": "K 1234 AHC",
                "nama_pemesan": "Mark",
                "jenis_mobil": "Kijang",
                "tanggal_masuk": "2024-04-26 09:56:56",
                "tanggal_keluar": "2024-04-26 12:56:56",
            }
            
# Reserve Endpoint
## 1. Insert Reserve Data
   * Method:
       - POST
   * Endpoint:
       - /api/reserve
   * Request Body:
       - `id_parkir` as `unsignedBigInteger`: Foreign id dari parkir
       - `id_user` as `unsignedBigInteger`: Foreign id dari user
       - `tanggal_masuk` as `date`: Tanggal masuk pemesan memulai parkir
       - `tanggal_keluar` as `date`: Tanggal keluar pemesan selesai parkir
   * Example:
   
            {
                "pesan": "Data Berhasil Ditambahkan",
                "data": {
                    "tanggal_masuk": "2024-04-26 09:56:56",
                    "tanggal_keluar": "2024-04-26 12:56:56",
                    "id_parkir": "1",
                    "id_user": "1"
                }
            }
   * Response:
        - 200 OK: Data berhasil ditambahkan
        - 400 Bad Request: Data gagal ditambahkan
            
## 2. Update Reserve Data
   * Method:
        - PUT
   * Endpoint:
        - /api/reserve/{id}
   * Request Body:
        - `id_parkir` as `unsignedBigInteger`: Foreign id dari parkir
        - `id_user` as `unsignedBigInteger`: Foreign id dari user
        - `tanggal_masuk` as `date`: Tanggal masuk pemesan memulai parkir
        - `tanggal_keluar` as `date`: Tanggal keluar pemesan selesai parkir
   * Response:
            200: Data sudah diupdate
            
## 3. Delete Reserve Data
   * Method:
        - DELETE
   * Endpoint:
        - /api/reserve/{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari reserve
   * Response:
            200: Data sudah dihapus
            
## 4. Get All Reserve Data
   * Method:
        - GET
   * Endpoint:
        - /api/parkir
   * Parameter:
        - All: Menampilkan semua atribut yang berada di dalam Reserve
   * Example:
   
           {
                "id": 1,
                "id_parkir": 1,
                "id_user": 2,
                "tanggal_masuk": "2024-04-26 09:56:56",
                "tanggal_keluar": "2024-04-26 12:56:56",
                "created_at": "2024-05-20T11:51:02.000000Z",
                "updated_at": "2024-05-20T11:51:02.000000Z",
                "parkir": {
                    "id": 1,
                    "id_slot": 1,
                    "plat_nomor": "K 8410 AHC",
                    "nama_pemesan": "Mark",
                    "jenis_mobil": "Kijang",
                    "tanggal_masuk": "2024-04-26 09:56:56",
                    "tanggal_keluar": "2024-04-26 12:56:56",
                    "created_at": "2024-05-20T11:39:41.000000Z",
                    "updated_at": "2024-05-20T11:39:41.000000Z",
                    "slot__parkir": {
                        "id": 1,
                        "id_blok": 1,
                        "slot_name": 1,
                        "status": "Terisi",
                        "x": "6487",
                        "y": "2948",
                        "created_at": "2024-05-20T11:33:38.000000Z",
                        "updated_at": "2024-05-20T11:39:41.000000Z",
                        "blok": {
                            "id": 1,
                            "id_fakultas": 1,
                            "nama": "Blok 1",
                            "longitude": "110.396866941956",
                            "latitude": "-7.048236137420003",
                            "created_at": "2024-05-20T11:29:42.000000Z",
                            "updated_at": "2024-05-20T11:29:42.000000Z",
                            "fakultas": {
                                "id": 1,
                                "nama": "Fakultas Ilmu Pendidikan dan Psikologi",
                                "longitude": "110.396866941956",
                                "latitude": "-7.048236137420003",
                                "created_at": "2024-05-20T11:29:07.000000Z",
                                "updated_at": "2024-05-20T11:29:07.000000Z"
                            }
                        }
                    }
                }
            },
            {
                "id": 2,
                "id_parkir": 2,
                "id_user": 1,
                "tanggal_masuk": "2024-04-26 09:56:56",
                "tanggal_keluar": "2024-04-26 12:56:56",
                "created_at": "2024-05-20T11:51:36.000000Z",
                "updated_at": "2024-05-20T11:51:36.000000Z",
                "parkir": {
                    "id": 2,
                    "id_slot": 8,
                    "plat_nomor": "K 2740 AC",
                    "nama_pemesan": "Rey",
                    "jenis_mobil": "Avanza",
                    "tanggal_masuk": "2024-04-26 08:56:56",
                    "tanggal_keluar": "2024-04-26 12:56:56",
                    "created_at": "2024-05-20T11:42:05.000000Z",
                    "updated_at": "2024-05-20T11:42:05.000000Z",
                    "slot__parkir": {
                        "id": 8,
                        "id_blok": 3,
                        "slot_name": 2,
                        "status": "Terisi",
                        "x": "3222",
                        "y": "7059",
                        "created_at": "2024-05-20T11:34:20.000000Z",
                        "updated_at": "2024-05-20T11:42:05.000000Z",
                        "blok": {
                            "id": 3,
                            "id_fakultas": 2,
                            "nama": "Blok 1",
                            "longitude": "110.396866941956",
                            "latitude": "-7.048236137420003",
                            "created_at": "2024-05-20T11:29:42.000000Z",
                            "updated_at": "2024-05-20T11:29:42.000000Z",
                            "fakultas": {
                                "id": 2,
                                "nama": "Fakultas Matematika & Ilmu Pengetahuan Alam",
                                "longitude": "110.39359139844254",
                                "latitude": "-7.050501773849033",
                                "created_at": "2024-05-20T11:29:07.000000Z",
                                "updated_at": "2024-05-20T11:29:07.000000Z"
                            }
                        }
                    }
                }
            }
   * Response:
   
            200 OK: Data Berhasil Ditampilkan
            400 Bad Request: Data Gagal Ditampilkan
            
## 5. Get Reserve Data Detail
   * Method:
        - GET
   * Endpoint:
        - /api/reserve/{id}
   * Parameter:
        - `id` as `bigIncrements`: id dari reserve
   * Example Endpoint to Get Reserve Data Detail:
   
            /api/reserve/1
   * Response:
   
            200 OK
            
            {
                "id": 1,
                "id_parkir": 1,
                "id_user": 1,
                "tanggal_masuk": "2024-04-26 09:56:56",
                "tanggal_keluar": "2024-04-26 12:56:56",
                "created_at": "2024-04-26T04:43:26.000000Z",
                "updated_at": "2024-04-26T04:43:26.000000Z"
            }
            
## 6. Download Struk Pesanan
   * Method:
       - GET
   * Endpoint:
       - /api/reserve/download-struk-reservasi/{id}
   * Example Endpoint:
   
         /api/reserve/download-struk-reservasi/1
         
   * Result:
   
           {
                "id": 1,
                "id_parkir": 1,
                "id_user": 2,
                "tanggal_masuk": "2024-04-26 09:56:56",
                "tanggal_keluar": "2024-04-26 12:56:56",
                "created_at": "2024-05-20T11:51:02.000000Z",
                "updated_at": "2024-05-20T11:51:02.000000Z"
            }
   * Response:
   
            200 OK: Data Berhasil Ditampilkan
            
#            
#
# ADMIN
# Register Admin Endpoint
   * Method:
       - POST
   * Endpoint:
       - /api/register-admin
   * Request Body:
       - `nama` as `string`: Nama dari Admin
       - `email` as `string`: Email dari Admin
       - `password` as `string`: Password dari Admin
   * Example:
        - Insert Data Yang Benar:
            nama: Admin
            email: admin@mail.unnes.ac.id
            password: admin12345
            
        - Insert Data Yang Salah, Contoh: Salah Memasukkan Data Domain Email, Domain Email Harus gmail.com atau mail.unnes.ac.id
          
   * Result:
        - Ketika Berhasil:
        
                {
                    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL3JlZ2lzdGVyLWFkbWluIiwiaWF0IjoxNzE5ODk0MzQ2LCJleHAiOjE3MTk4OTc5NDYsIm5iZiI6MTcxOTg5NDM0NiwianRpIjoicDJucTdoQURlazVhOHg5NSIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.4g0EtGyvVZr134mfrpgi0tm_p4r3gTmvp3PC6dGJPyM",
                    "token_type": "bearer",
                    "expires_in": 3600
                }
                
        - Ketika Gagal:
        
                {
                    "status": "error",
                    "message": "Email domain is not allowed"
                }
        
   * Response Code:
       - 200: OK
       - 400: Bad Request
       
# Login Admin Endpoint
   * Method:
       - POST
   * Endpoint:
       - /api/login-admin
   * Request Body:
       - `email` as `string`: Email dari Admin
       - `password` as `string`: Password dari Admin
   * Example:
       - Insert data yang benar harus memasukkan data sesuai dengan data yang telah diregister:
            email: admin@mail.unnes.ac.id
            password: admin12345
            
       - Insert data yang salah karena tidak sesuai dengan data yang telah diregister, contoh:
            email: admin@yahoo.com
            password: admin12345
   * Result:
        - Ketika berhasil:
            
                {
                    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luLWFkbWluIiwiaWF0IjoxNzE5ODk2MDkwLCJleHAiOjE3MTk4OTk2OTAsIm5iZiI6MTcxOTg5NjA5MCwianRpIjoiQnNydVVJcklHcDFWazIzbyIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.NojZsbWX1no0TdR7zovfglcT2Ll40_1mx2WfCznFZnA",
                    "token_type": "bearer",
                    "expires_in": 3600
                }
                
        - Ketika gagal:
        
                {
                    "status": "error",
                    "message": "Email is not registered"
                }
                
   * Response Code:
        - 200: Ok
        - 401: Unauthorized
        
# Logout Admin Endpoint
   * Method:
       - POST
   * Endpoint:
       - /api/
       
# Slot Parkir Admin Endpoint
## 1. Insert Slot Parkir Data
   * Method:
       - POST
   * Endpoint:
       - /api/admin/slot-parkir
   * Request Body:
       - `id_blok` as `unsignedBigInteger`: Foreign id dari blok
       - `slot_name` as `string`: Slot Nama dari tempat parkir
       - `status` as `string`: Kondisi status dari slot name dengan default kosong
       - `x` as `string`: Koordinat sumbu X
       - `y` as `string`: Koordinat sumbu Y
   * Example:
   
            {
                "status": 200,
                "pesan": "Data Berhasil Ditambahkan",
                "data": {
                    "slot_name": "1",
                    "status": "Terisi",
                    "x": "2.143",
                    "y": "-42.145",
                    "id_blok": "1"
                }
            }
   * Response:
        - 200 OK: Data berhasil ditambahkan
        - 400 Bad Request: Data gagal ditambahkan
            
## 2. Update Slot Parkir Data
   * Method:
        - PUT
   * Endpoint:
        - /api/slot-parkir/{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari slot parkir
        - `id_blok` as `unsignedBigInteger`: Foreign id dari blok
        - `slot_name` as `string`: Slot Nama dari tempat parkir
        - `status` as `string`: Kondisi status dari slot name dengan default kosong
        - `x` as `string`: Koordinat sumbu X
        - `y` as `string`: Koordinat sumbu Y
   * Example Endpoint to Update Slot Parkir Data:
   
            api/admin/slot-parkir/218
   * Example:
        
            {
                "status": "success",
                "pesan": "Data Berhasil Diupdate",
                "data": {
                    "id": 218,
                    "id_blok": 5,
                    "slot_name": 1,
                    "status": "Kosong",
                    "x": "25",
                    "y": "1",
                    "created_at": "2024-07-21 21:52:09",
                    "updated_at": "2024-07-22 16:48:08"
                }
            }
   * Response:
            200: Data sudah diupdate
            
## 3. Delete Slot Parkir Data
   * Method:
        - DELETE
   * Endpoint:
        - /api/admin/slot-parkir/{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari slot parkir
   * Response:
            200: Data sudah dihapus
            
## 4. Get All id Slot Parkir Data
   * Method:
        - GET
   * Endpoint:
        - /api/admin/slot-parkir/get-all-slot-blok-1
   * Parameter:
        - All: Menampilkan semua id slot_parkir yang berada di dalam blok 1
   * Example:
        
            {
                "id": 17,
                "slot_name": 1,
                "status": "Dibooking",
                "x": "1",
                "y": "1",
                "id_blok": 1,
                "created_at": "2024-07-25 13:46:22"
            },
            {
                "id": 18,
                "slot_name": 2,
                "status": "Dibooking",
                "x": "2",
                "y": "1",
                "id_blok": 1,
                "created_at": "2024-07-25 13:46:22"
            },
            {
                "id": 19,
                "slot_name": 3,
                "status": "Kosong",
                "x": "3",
                "y": "1",
                "id_blok": 1,
                "created_at": "2024-07-25 13:46:22"
            },
            {
                "id": 20,
                "slot_name": 4,
                "status": "Kosong",
                "x": "4",
                "y": "1",
                "id_blok": 1,
                "created_at": "2024-07-25 13:46:22"
            }
   * Response:
            200 OK: Data Berhasil Ditampilkan
            400 Bad Request: Data Gagal Ditampilkan
            
## 5. Get id_blok, slot_name, status Slot Parkir Data
   * Method:
        - GET
   * Endpoint:
        - /api/admin/slot-parkir/get-idblok-slotname-status
   * Parameter:
        - All: Menampilkan semua id yang berada di dalam slot parkir
   * Example:
        
            {
                "id": 17,
                "slot_name": 1,
                "status": "Dibooking",
                "id_blok": 1
            },
            {
                "id": 13,
                "slot_name": 1,
                "status": "Terisi",
                "id_blok": 1
            },
            {
                "id": 5,
                "slot_name": 1,
                "status": "Kosong",
                "id_blok": 2
            },
            {
                "id": 9,
                "slot_name": 1,
                "status": "Terisi",
                "id_blok": 2
            },
            {
                "id": 18,
                "slot_name": 2,
                "status": "Dibooking",
                "id_blok": 1
            },
            {
                "id": 14,
                "slot_name": 2,
                "status": "Terisi",
                "id_blok": 1
            },
            {
                "id": 10,
                "slot_name": 2,
                "status": "Kosong",
                "id_blok": 2
            },
            {
                "id": 19,
                "slot_name": 3,
                "status": "Kosong",
                "id_blok": 1
            },
            {
                "id": 15,
                "slot_name": 3,
                "status": "Terisi",
                "id_blok": 1
            },
            {
                "id": 11,
                "slot_name": 3,
                "status": "Kosong",
                "id_blok": 2
            },
            {
                "id": 7,
                "slot_name": 3,
                "status": "Terisi",
                "id_blok": 2
            },
            {
                "id": 20,
                "slot_name": 4,
                "status": "Kosong",
                "id_blok": 1
            },
            {
                "id": 16,
                "slot_name": 4,
                "status": "Terisi",
                "id_blok": 1
            },
            {
                "id": 12,
                "slot_name": 4,
                "status": "Kosong",
                "id_blok": 2
            }
   * Response:
            200 OK: Data Berhasil Ditampilkan
            400 Bad Request: Data Gagal Ditampilkan
            
## 6. Get Slot Parkir Data Detail
   * Method:
        - GET
   * Endpoint:
        - /api/admin/slot-parkir/{id}
   * Parameter:
        - `id` as `bigIncrements`: id dari slot parkir
   * Example Endpoint to Get Slot Parkir Data Detail:
   
            /api/admin/slot-parkir/2
   * Response:
   
            200 OK
            
            {
                "id": 2,
                "id_blok": 1,
                "slot_name": 3,
                "status": "Kosong",
                "x": "2.143",
                "y": "-42.145",
                "created_at": "2024-04-26T03:36:17.000000Z",
                "updated_at": "2024-04-26T03:36:17.000000Z"
            }
            
## 7. Ubah Data Status Terisi ke Kosong berdasarkan id_blok dan slot_name di Slot Parkir
   * Method:
       - POST
   * Endpoint:
       - https://sparka-be-fgzuswhm2q-et.a.run.app/api/admin/slot-parkir/ubah-slot-ke-kosong
   * Request Body:
       - `id_blok` as `integer`: Id dari blok
       - `slot_name` as `string`: Nama slot parkir
   * Example:
       - Ketika status asal Dibooking  
       
                id_blok: 1
                slot_name: 2
                
       - Ketika status asal Terisi
       
                id_blok: 1
                slot_name: 3
                         
   * Response:
       - Ketika status asal Dibooking, maka akan gagal
            
                {
                    "status": "error",
                    "pesan": "Mohon maaf slot parkir sudah dibooking, silahkan pindah ke slot parkir lain""
                }
                
       - Ketika status asal Terisi, maka akan sukses  
  
                {
                    "status": "success",
                    "pesan": "Slot parkir berhasil diubah ke Kosong",
                    "data": {
                        "id": 19,
                        "id_blok": 1,
                        "slot_name": 3,
                        "status": "Kosong",
                        "x": "3",
                        "y": "1",
                        "created_at": "2024-07-25 13:46:22",
                        "updated_at": "2024-07-25 14:33:43"
                    }
                }
   * Status Response:
   
            200 OK: Data Berhasil Ditampilkan
            400 Bad Request: Data Gagal Ditampilkan
                
## 8. Ubah Data Status Kosong ke Terisi berdasarkan id_blok dan slot_name di Slot Parkir
   * Method:
        - POST
   * Endpoint:
       - https://sparka-be-fgzuswhm2q-et.a.run.app/api/admin/slot-parkir/ubah-slot-ke-terisi
   * Request Body:
       - `id_blok` as `integer`: Id dari blok
       - `slot_name` as `string`: Nama slot parkir
   * Example:
       - Ketika status asal Dibooking  
       
                id_blok: 1
                slot_name: 2
                
       - Ketika status asal Kosong
       
                id_blok: 1
                slot_name: 3
                         
   * Response:
       - Ketika status asal Dibooking, maka akan gagal
            
                {
                    "status": "error",
                    "pesan": "Mohon maaf slot parkir sudah dibooking, silahkan pindah ke slot parkir lain"
                }
                
       - Ketika status asal Kosong, maka akan sukses  
  
                {
                    "status": "success",
                    "pesan": "Slot parkir berhasil diubah ke Terisi",
                    "data": {
                        "id": 19,
                        "id_blok": 1,
                        "slot_name": 3,
                        "status": "Terisi",
                        "x": "3",
                        "y": "1",
                        "created_at": "2024-07-25 13:46:22",
                        "updated_at": "2024-07-25 14:43:08"
                    }
                }
   * Status Response:
   
            200 OK: Slot parkir berhasil diubah ke Terisi
            400 Bad Request: Mohon maaf slot parkir sudah dibooking, silahkan pindah ke slot parkir lain
                
# Parkir Endpoint Admin
   * Method:
       - POST
   * Endpoint:
       - https://sparka-be-fgzuswhm2q-et.a.run.app/api/admin/parkir/ubah-slot-ke-kosong
   * Request Body:
       - `plat_nomor` as `string`: plat nomor
   * Example:
       plat_nomor: AB2051ZX
                         
   * Response:
   
           {
                "status": "success",
                "pesan": "Slot parkir berhasil diubah ke Kosong",
                "data": {
                    "id": 242,
                    "id_blok": 1,
                    "slot_name": 4,
                    "status": "Kosong",
                    "x": "1",
                    "y": "3",
                    "created_at": "2024-07-24 14:48:47",
                    "updated_at": "2024-07-25 16:11:56"
                }
            }
   * Status Response:
   
            200 OK: Slot parkir berhasil diubah ke Kosong
            400 Bad Request: Status slot parkir sudah kosong

# LogKendaraan Endpoint
## 1. Insert LogKendaraan Data
   * Method:
       - POST
   * Endpoint:
       - /api/admin/log-kendaraan
   * Request Body:
       - `id_parkir` as `bigIncrements`: Id dari parkir / plat nomor
       - `capture_time` as `dateTime`: Waktu tercatat
       - `vehicle` as `string`: Nama Kendaraan
       - `location` as `string`: Lokasi
       - `image` as `binary`: Gambar
   * Example:
   
            {
                "pesan": "Data Berhasil Ditambahkan",
                "data": {
                    "id_parkir": "1",
                    "capture_time": "2024-05-13 08:10:56",
                    "vehicle": "Fortuner",
                    "location": "Fakultas Teknik"
                }
            }
   * Response Code:
        - 200 OK: Data berhasil ditambahkan
        - 400 Bad Request: Data gagal ditambahkan
            
## 2. Update LogKendaraan Data
   * Method:
        - PUT
   * Endpoint:
        - /api/admin/log-kendaraan/{id}
   * Request Body:
        - `capture_time` as `dateTime`: Waktu tercatat
        - `vehicle` as `string`: Nama Kendaraan
        - `plat_nomor` as `string`: Nomor kendaraan
        - `location` as `string`: Lokasi
   * Response Code:
            200: Data sudah diupdate
            
## 3. Delete LogKendaraan Data
   * Method:
        - DELETE
   * Endpoint:
        - /api/admin/log-kendaraan/{id}
   * Request Body:
        - `id` as `bigIncrements`: id dari LogKendaraan
   * Response Code:
            200: Data sudah dihapus
            
## 4. Get All LogKendaraan Data
   * Method:
        - GET
   * Endpoint:
        - /api/admin/log-kendaraan
   * Parameter:
        - All: Menampilkan semua data yang berada di dalam LogKendaraan
   * Response:
            
            {
                "id": 1,
                "id_parkir": 1,
                "capture_time": "2024-04-26 09:56:57",
                "vehicle": "Ayla",
                "location": "Fakultas Ilmu Pendidikan dan Psikologi",
                "created_at": "2024-06-11T08:46:45.000000Z",
                "updated_at": "2024-06-11T08:46:45.000000Z"
            },
            {
                "id": 2,
                "id_parkir": 2,
                "capture_time": "2024-04-26 09:56:57",
                "vehicle": "Avanza",
                "location": "Fakultas Matematika dan Ilmu Pengetahuan Alam",
                "created_at": "2024-06-11T08:47:56.000000Z",
                "updated_at": "2024-06-11T08:47:56.000000Z"
            },
            {
                "id": 3,
                "id_parkir": 1,
                "capture_time": "2024-05-13 08:10:56",
                "vehicle": "Fortuner",
                "location": "Fakultas Teknik",
                "created_at": "2024-06-12T08:09:12.000000Z",
                "updated_at": "2024-06-12T08:09:12.000000Z"
            }
        
   * Response Code:
   
            200 OK: Data Berhasil Ditampilkan
            400 Bad Request: Data Not Found
            
## 5. Get LogKendaraan Data Detail
   * Method:
        - GET
   * Endpoint:
        - /api/admin/log-kendaraan/{id}
   * Parameter:
        - `id` as `bigIncrements`: id dari reserve
   * Example Endpoint to Get LogKendaraan Data Detail:
   
            /api/admin/log-kendaraan/1
   * Response:
   
            {
                "id": 1,
                "id_parkir": 1,
                "capture_time": "2024-04-26 09:56:57",
                "vehicle": "Ayla",
                "location": "Fakultas Ilmu Pendidikan dan Psikologi",
                "created_at": "2024-06-11T08:46:45.000000Z",
                "updated_at": "2024-06-11T08:46:45.000000Z"
            }
            
# Capture Image Endpoint
## 1. Insert CaptureImage Data
   * Method:
        - POST
   * Endpoint: 
        - /api/admin/capture-image
   * Request Body:
        - `image` as `image`: Capture Mobil
   * Example:
        
            image: mobil.jpg (untuk gambar bisa dari local)
   * Response:
   
            {
                "message": "Image captured successfully"
            }
   * Response Code:
   
            201 OK: Image captured successfully
            422 Unprocessing Content: The image field is required.
            
## 2. Delete CaptureImage Data
   * Method:
        - Delete
   * Endpoint:
        - /api/admin/capture-image/3
   * Request Body:
        - `id` as `bigIncrements`: id dari CaptureImage yang ingin didelete
   * Response Code:
   
            200 OK: Data Berhasil Didelete
            
# Monitor Endpoint
## 1. Insert Monitor Data
   * Method:
        - POST
   * Endpoint:
        - /api/admin/monitor-kendaraan
   * Request Body:
        - `id_parkir` as `unsignedBigInteger`: id dari parki
        - `id_slot` as `unsignedBigInteger`: id dari slot parkir
   * Example:
