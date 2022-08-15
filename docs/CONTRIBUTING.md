# Table of Contents

- [Table of Contents](#table-of-contents)
- [Panduan Kontribusi](#panduan-kontribusi)
    - [Reminder](#reminder)
    - [Tipe-tipe Branch](#tipe-tipe-branch)
  - [Ketentuan Commit](#ketentuan-commit)
    - [Tipe Commit](#tipe-commit)

# Panduan Kontribusi

### Reminder

**Dalam development harap membuat code yang dapat di maintain untuk kedepannya bagi developer lain.**

### Tipe-tipe Branch

Pada repo ini kita akan menggunakan beberapa tipe `branch`. diantaranya yaitu:

| Tipe          | Deskripsi                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------- |
| `main`        | Branch utama, branch ini perlu dilindungi dan dipastikan tidak ada error                     |
| `development` | Branch pengembangan, fitur-fitur yang sudah selesai dikembangkan akan di merge ke branch ini |

## Ketentuan Commit

Pesan commit harus memiliki format sebagai berikut:

```
<tipe>: <deksripsi>
```

### Tipe Commit

Berikut merupakan tipe-tipe pesan commit yang dapat digunakan:

| Tipe       | Deskripsi                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `feat`     | Implementasi fitur baru (cth: `feat: menambahkan halaman cart`)                                                                          |
| `fix`      | perbaikan bug / error (e.g. `fix: item in card is not showing`)                                                                          |
| `docs`     | Menambah / memperbarui dokumentasi (e.g. `docs: menambahkan file README.md`)                                                             |
| `refactor` | Refactoring kode, mengganti nama variable, menambahkan semikolon, formatting, dsb. (e.g. `refactor: mengubah nama fungsi`)               |
| `test`     | Menambahkan testing pada kode (e.g. `test: menambahkan unit test untuk addItemIntoCart()`)                                               |
| `chore`    | Menambahkan kode yang tidak berhubungan dengan semua tipe diatas. Menata kode, membuat file setup, dsb. (e.g. `chore: initiate project`) |

Setiap commit yang menyebabkan aplikasi versi sebelumnya tidak dapat berjalan dengan semestinya (lihat: [breaking changes](https://nordicapis.com/what-are-breaking-changes-and-how-do-you-avoid-them/)), harus ditambahkan `(breaking change)` pada pesan commitnya. Sebagai contoh: `refactor (breaking): memindahkan modul cart ke folder components`.

Untuk lebih jelasnya dapat dibaca lagi mengenai ketentuan commit ini di [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
