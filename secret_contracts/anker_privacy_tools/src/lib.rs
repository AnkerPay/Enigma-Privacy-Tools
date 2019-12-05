// Built-In Attributes
#![no_std]

// Imports
use eng_wasm::*;
use eng_wasm_derive::pub_interface;
use serde::{Serialize, Deserialize};

static PRIVACYINFO: &str = "privacyinfos";

// Structs
#[derive(Serialize, Deserialize)]
pub struct PrivacyInfo {
    email: String,
    ankaddress: String,
}


// Public struct Contract which will consist of private and public-facing secret contract functions
struct PrivacyContract;


#[pub_interface]

impl PrivacyContract {

    fn get_emails() -> Vec<PrivacyInfo> {
        read_state!(PRIVACYINFO).unwrap_or_default()
    }

    pub fn add_email(email: String, ankaddress: String) {
        let mut privacyinfos = Self::get_emails();
        privacyinfos.push(PrivacyInfo {
            email,
            ankaddress,
        });
        write_state!(PRIVACYINFO => privacyinfos);
    }

    pub fn check_email(email: String) -> String {
        let privacyinfos = Self::get_emails();
        let index = privacyinfos.iter().position(|r| r.email == email).unwrap();
        return privacyinfos[index].ankaddress.clone();
    }

}
