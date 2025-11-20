# Database Seed Information

## Overview
The database seed script has been updated to include users and administrators for every office and department in the JUST inventory management system.

## Default Password
**All users have the same default password: `password`**
- Hashed value: `$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`

## System-Level Users
1. **superadmin** - Super Administrator with full access
2. **admin** - System Administrator

## User Naming Convention
For each office/department, two users are created:
- **user_{code}** - Regular user (ROLE_STAFF or ROLE_FACULTY_MEMBER)
- **admin_{code}** - Administrator (ROLE_ADMIN or ROLE_DEPARTMENT_HEAD)

## Complete User List

### Administrative Offices
| Username | Email | Name | Office | Role |
|----------|-------|------|--------|------|
| user_chan | user.chan@just.edu.bd | Chancellor Office User | Chancellor Office | STAFF |
| admin_chan | admin.chan@just.edu.bd | Chancellor Office Admin | Chancellor Office | ADMIN |
| user_vc | user.vc@just.edu.bd | Vice Chancellor Office User | Vice Chancellor Office | STAFF |
| admin_vc | admin.vc@just.edu.bd | Vice Chancellor Office Admin | Vice Chancellor Office | ADMIN |
| user_pvc | user.pvc@just.edu.bd | Pro Vice Chancellor Office User | Pro Vice Chancellor Office | STAFF |
| admin_pvc | admin.pvc@just.edu.bd | Pro Vice Chancellor Office Admin | Pro Vice Chancellor Office | ADMIN |
| user_treas | user.treas@just.edu.bd | Treasurer Office User | Treasurer Office | STAFF |
| admin_treas | admin.treas@just.edu.bd | Treasurer Office Admin | Treasurer Office | ADMIN |

### Faculty of Engineering & Technology
| Username | Email | Name | Faculty | Role |
|----------|-------|------|---------|------|
| user_fet | user.fet@just.edu.bd | Faculty of Engineering & Technology User | Faculty of Engineering & Technology | STAFF |
| admin_fet | admin.fet@just.edu.bd | Faculty of Engineering & Technology Admin | Faculty of Engineering & Technology | ADMIN |

### Engineering Departments
| Username | Email | Name | Department | Role |
|----------|-------|------|------------|------|
| user_che | user.che@just.edu.bd | Chemical Engineering User | Chemical Engineering | FACULTY_MEMBER |
| admin_che | admin.che@just.edu.bd | Chemical Engineering Admin | Chemical Engineering | DEPARTMENT_HEAD |
| user_ipe | user.ipe@just.edu.bd | IPE User | Industrial & Production Engineering | FACULTY_MEMBER |
| admin_ipe | admin.ipe@just.edu.bd | IPE Admin | Industrial & Production Engineering | DEPARTMENT_HEAD |
| user_pme | user.pme@just.edu.bd | PME User | Petroleum & Mining Engineering | FACULTY_MEMBER |
| admin_pme | admin.pme@just.edu.bd | PME Admin | Petroleum & Mining Engineering | DEPARTMENT_HEAD |
| user_eee | user.eee@just.edu.bd | EEE User | Electrical & Electronic Engineering | FACULTY_MEMBER |
| admin_eee | admin.eee@just.edu.bd | EEE Admin | Electrical & Electronic Engineering | DEPARTMENT_HEAD |
| user_te | user.te@just.edu.bd | Textile Engineering User | Textile Engineering | FACULTY_MEMBER |
| admin_te | admin.te@just.edu.bd | Textile Engineering Admin | Textile Engineering | DEPARTMENT_HEAD |
| user_bme | user.bme@just.edu.bd | Bio-Medical Engineering User | Bio-Medical Engineering | FACULTY_MEMBER |
| admin_bme | admin.bme@just.edu.bd | Bio-Medical Engineering Admin | Bio-Medical Engineering | DEPARTMENT_HEAD |
| user_me | user.me@just.edu.bd | Mechatronics Engineering User | Mechatronics Engineering | FACULTY_MEMBER |
| admin_me | admin.me@just.edu.bd | Mechatronics Engineering Admin | Mechatronics Engineering | DEPARTMENT_HEAD |

### Computing & Information Engineering
| Username | Email | Name | Department | Role |
|----------|-------|------|------------|------|
| user_cse | user.cse@just.edu.bd | CSE User | Computer Science & Engineering | FACULTY_MEMBER |
| admin_cse | admin.cse@just.edu.bd | CSE Admin | Computer Science & Engineering | DEPARTMENT_HEAD |
| user_se | user.se@just.edu.bd | Software Engineering User | Software Engineering | FACULTY_MEMBER |
| admin_se | admin.se@just.edu.bd | Software Engineering Admin | Software Engineering | DEPARTMENT_HEAD |
| user_cb | user.cb@just.edu.bd | Computational Biology User | Computational Biology | FACULTY_MEMBER |
| admin_cb | admin.cb@just.edu.bd | Computational Biology Admin | Computational Biology | DEPARTMENT_HEAD |

### Biological Science & Technology
| Username | Email | Name | Department | Role |
|----------|-------|------|------------|------|
| user_mb | user.mb@just.edu.bd | Microbiology User | Microbiology | FACULTY_MEMBER |
| admin_mb | admin.mb@just.edu.bd | Microbiology Admin | Microbiology | DEPARTMENT_HEAD |
| user_fmb | user.fmb@just.edu.bd | FMB User | Fisheries & Marine Bio-science | FACULTY_MEMBER |
| admin_fmb | admin.fmb@just.edu.bd | FMB Admin | Fisheries & Marine Bio-science | DEPARTMENT_HEAD |
| user_geb | user.geb@just.edu.bd | GEB User | Genetic Engineering & Biotechnology | FACULTY_MEMBER |
| admin_geb | admin.geb@just.edu.bd | GEB Admin | Genetic Engineering & Biotechnology | DEPARTMENT_HEAD |
| user_phar | user.phar@just.edu.bd | Pharmacy User | Pharmacy | FACULTY_MEMBER |
| admin_phar | admin.phar@just.edu.bd | Pharmacy Admin | Pharmacy | DEPARTMENT_HEAD |
| user_bmb | user.bmb@just.edu.bd | BMB User | Biochemistry & Molecular Biology | FACULTY_MEMBER |
| admin_bmb | admin.bmb@just.edu.bd | BMB Admin | Biochemistry & Molecular Biology | DEPARTMENT_HEAD |

### Health Science
| Username | Email | Name | Department | Role |
|----------|-------|------|------------|------|
| user_pess | user.pess@just.edu.bd | PESS User | Physical Education Sports Science | FACULTY_MEMBER |
| admin_pess | admin.pess@just.edu.bd | PESS Admin | Physical Education Sports Science | DEPARTMENT_HEAD |
| user_nhs | user.nhs@just.edu.bd | NHS User | Nursing & Health Science | FACULTY_MEMBER |
| admin_nhs | admin.nhs@just.edu.bd | NHS Admin | Nursing & Health Science | DEPARTMENT_HEAD |
| user_ptr | user.ptr@just.edu.bd | PTR User | Physiotherapy and Rehabilitation | FACULTY_MEMBER |
| admin_ptr | admin.ptr@just.edu.bd | PTR Admin | Physiotherapy and Rehabilitation | DEPARTMENT_HEAD |
| user_ph | user.ph@just.edu.bd | Public Health User | Public Health | FACULTY_MEMBER |
| admin_ph | admin.ph@just.edu.bd | Public Health Admin | Public Health | DEPARTMENT_HEAD |

### Science Departments
| Username | Email | Name | Department | Role |
|----------|-------|------|------------|------|
| user_phy | user.phy@just.edu.bd | Physics User | Physics | FACULTY_MEMBER |
| admin_phy | admin.phy@just.edu.bd | Physics Admin | Physics | DEPARTMENT_HEAD |
| user_math | user.math@just.edu.bd | Mathematics User | Mathematics | FACULTY_MEMBER |
| admin_math | admin.math@just.edu.bd | Mathematics Admin | Mathematics | DEPARTMENT_HEAD |
| user_chem | user.chem@just.edu.bd | Chemistry User | Chemistry | FACULTY_MEMBER |
| admin_chem | admin.chem@just.edu.bd | Chemistry Admin | Chemistry | DEPARTMENT_HEAD |
| user_cdm | user.cdm@just.edu.bd | CDM User | Climate and Disaster Management | FACULTY_MEMBER |
| admin_cdm | admin.cdm@just.edu.bd | CDM Admin | Climate and Disaster Management | DEPARTMENT_HEAD |

### Applied Science & Technology
| Username | Email | Name | Department | Role |
|----------|-------|------|------------|------|
| user_est | user.est@just.edu.bd | EST User | Environmental Science and Technology | FACULTY_MEMBER |
| admin_est | admin.est@just.edu.bd | EST Admin | Environmental Science and Technology | DEPARTMENT_HEAD |
| user_nft | user.nft@just.edu.bd | NFT User | Nutrition & Food Technology | FACULTY_MEMBER |
| admin_nft | admin.nft@just.edu.bd | NFT Admin | Nutrition & Food Technology | DEPARTMENT_HEAD |
| user_as | user.as@just.edu.bd | Applied Statistics User | Applied Statistics | FACULTY_MEMBER |
| admin_as | admin.as@just.edu.bd | Applied Statistics Admin | Applied Statistics | DEPARTMENT_HEAD |
| user_fsm | user.fsm@just.edu.bd | FSM User | Food Safety Management | FACULTY_MEMBER |
| admin_fsm | admin.fsm@just.edu.bd | FSM Admin | Food Safety Management | DEPARTMENT_HEAD |
| user_cnd | user.cnd@just.edu.bd | CND User | Clinical Nutrition & Dietetics | FACULTY_MEMBER |
| admin_cnd | admin.cnd@just.edu.bd | CND Admin | Clinical Nutrition & Dietetics | DEPARTMENT_HEAD |

### Agricultural Science & Technology
| Username | Email | Name | Department | Role |
|----------|-------|------|------------|------|
| user_appt | user.appt@just.edu.bd | APPT User | Agro Product Processing Technology | FACULTY_MEMBER |
| admin_appt | admin.appt@just.edu.bd | APPT Admin | Agro Product Processing Technology | DEPARTMENT_HEAD |
| user_vas | user.vas@just.edu.bd | VAS User | Veterinary & Animal Sciences | FACULTY_MEMBER |
| admin_vas | admin.vas@just.edu.bd | VAS Admin | Veterinary & Animal Sciences | DEPARTMENT_HEAD |
| user_ae | user.ae@just.edu.bd | Agricultural Engineering User | Agricultural Engineering | FACULTY_MEMBER |
| admin_ae | admin.ae@just.edu.bd | Agricultural Engineering Admin | Agricultural Engineering | DEPARTMENT_HEAD |
| user_aemp | user.aemp@just.edu.bd | AEMP User | Agricultural Economics & Marketing Policy | FACULTY_MEMBER |
| admin_aemp | admin.aemp@just.edu.bd | AEMP Admin | Agricultural Economics & Marketing Policy | DEPARTMENT_HEAD |
| user_cs | user.cs@just.edu.bd | Crop Science User | Crop Science | FACULTY_MEMBER |
| admin_cs | admin.cs@just.edu.bd | Crop Science Admin | Crop Science | DEPARTMENT_HEAD |

### Business Studies
| Username | Email | Name | Department | Role |
|----------|-------|------|------------|------|
| user_ais | user.ais@just.edu.bd | AIS User | Accounting & Information System | FACULTY_MEMBER |
| admin_ais | admin.ais@just.edu.bd | AIS Admin | Accounting & Information System | DEPARTMENT_HEAD |
| user_mgt | user.mgt@just.edu.bd | Management User | Management | FACULTY_MEMBER |
| admin_mgt | admin.mgt@just.edu.bd | Management Admin | Management | DEPARTMENT_HEAD |
| user_fb | user.fb@just.edu.bd | Finance & Banking User | Finance & Banking | FACULTY_MEMBER |
| admin_fb | admin.fb@just.edu.bd | Finance & Banking Admin | Finance & Banking | DEPARTMENT_HEAD |
| user_mkt | user.mkt@just.edu.bd | Marketing User | Marketing | FACULTY_MEMBER |
| admin_mkt | admin.mkt@just.edu.bd | Marketing Admin | Marketing | DEPARTMENT_HEAD |

### Arts & Social Science
| Username | Email | Name | Department | Role |
|----------|-------|------|------------|------|
| user_eng | user.eng@just.edu.bd | English User | English | FACULTY_MEMBER |
| admin_eng | admin.eng@just.edu.bd | English Admin | English | DEPARTMENT_HEAD |
| user_hum | user.hum@just.edu.bd | Humanities User | Humanities | FACULTY_MEMBER |
| admin_hum | admin.hum@just.edu.bd | Humanities Admin | Humanities | DEPARTMENT_HEAD |

### Administrative Services
| Username | Email | Name | Office | Role |
|----------|-------|------|--------|------|
| user_reg | user.reg@just.edu.bd | Registrar User | Office of the Registrar | STAFF |
| admin_reg | admin.reg@just.edu.bd | Registrar Admin | Office of the Registrar | ADMIN |
| user_lib | user.lib@just.edu.bd | Librarian User | Office of the Librarian | STAFF |
| admin_lib | admin.lib@just.edu.bd | Librarian Admin | Office of the Librarian | ADMIN |
| user_coe | user.coe@just.edu.bd | COE User | Controller of Examinations | STAFF |
| admin_coe | admin.coe@just.edu.bd | COE Admin | Controller of Examinations | ADMIN |
| user_ce | user.ce@just.edu.bd | Chief Engineer User | Chief Engineer | STAFF |
| admin_ce | admin.ce@just.edu.bd | Chief Engineer Admin | Chief Engineer | ADMIN |
| user_cmo | user.cmo@just.edu.bd | CMO User | Chief Medical Officer | STAFF |
| admin_cmo | admin.cmo@just.edu.bd | CMO Admin | Chief Medical Officer | ADMIN |
| user_da | user.da@just.edu.bd | Director Account User | Director (Account) | STAFF |
| admin_da | admin.da@just.edu.bd | Director Account Admin | Director (Account) | ADMIN |
| user_pdw | user.pdw@just.edu.bd | PDW User | Planning Development & Works | STAFF |
| admin_pdw | admin.pdw@just.edu.bd | PDW Admin | Planning Development & Works | ADMIN |
| user_dpe | user.dpe@just.edu.bd | Director PE User | Director (Physical Education) | STAFF |
| admin_dpe | admin.dpe@just.edu.bd | Director PE Admin | Director (Physical Education) | ADMIN |
| user_proc | user.proc@just.edu.bd | Proctor User | Proctors Office | STAFF |
| admin_proc | admin.proc@just.edu.bd | Proctor Admin | Proctors Office | ADMIN |
| user_trans | user.trans@just.edu.bd | Transport User | Transport Administrator | STAFF |
| admin_trans | admin.trans@just.edu.bd | Transport Admin | Transport Administrator | ADMIN |
| user_audit | user.audit@just.edu.bd | Audit User | Audit Cell | STAFF |
| admin_audit | admin.audit@just.edu.bd | Audit Admin | Audit Cell | ADMIN |
| user_ict | user.ict@just.edu.bd | ICT User | ICT Cell | STAFF |
| admin_ict | admin.ict@just.edu.bd | ICT Admin | ICT Cell | ADMIN |
| user_iqac | user.iqac@just.edu.bd | IQAC User | IQAC | STAFF |
| admin_iqac | admin.iqac@just.edu.bd | IQAC Admin | IQAC | ADMIN |
| user_scg | user.scg@just.edu.bd | SCG User | Student Counseling & Guidance | STAFF |
| admin_scg | admin.scg@just.edu.bd | SCG Admin | Student Counseling & Guidance | ADMIN |

## Total Statistics
- **Total Users**: 104 (2 system admins + 102 office/department/faculty users)
- **Total Offices/Departments/Faculties**: 51
- **User-to-Office Ratio**: 2 users per office (1 regular user + 1 admin)

## Roles Overview
- **ROLE_SUPER_ADMIN**: Full system access (superadmin)
- **ROLE_ADMIN**: Administrative access for offices (admin_{code} users)
- **ROLE_DEPARTMENT_HEAD**: Department leadership with purchasing power (admin_{code} for departments)
- **ROLE_FACULTY_MEMBER**: Department faculty (user_{code} for academic departments)
- **ROLE_STAFF**: Staff access for offices (user_{code} for administrative offices)

## Running the Seed Script

To populate the database with all users and offices:

```bash
# Navigate to backend directory
cd backend

# Run the seed script using MySQL
mysql -u your_username -p your_database < src/main/resources/sql/database_seed.sql
```

Or if using the application properties:
```bash
# Make sure database_migration_v2.sql is run first
# Then run database_seed.sql
```

## Testing Login
You can test login with any user:
- **Username**: Any username from the tables above (e.g., `user_cse`, `admin_ict`)
- **Password**: `password`

## Security Note
⚠️ **Important**: Change all default passwords in production! The default password is meant for development/testing only.
