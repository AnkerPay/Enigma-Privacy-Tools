// Built-In Attributes
#![no_std]

// Imports
extern crate eng_wasm;
extern crate eng_wasm_derive;
extern crate serde;
use eng_wasm::*;
use eng_wasm_derive::pub_interface;
use serde::{Serialize, Deserialize};

static PRIVACYINFO: &str = "PrivacyInfo";

// Structs
#[derive(Serialize, Deserialize)]
pub struct PrivacyInfo {
    email: String,
    ankaddress: String,
}


// Public struct Contract which will consist of private and public-facing secret contract functions
pub struct Contract;

// Private functions accessible only by the secret contract
impl Contract {
    fn get_emails() -> Vec<PrivacyInfo> {
        read_state!(PRIVACYINFO).unwrap_or_default()
    }
}

// Public trait defining public-facing secret contract functions
#[pub_interface]
pub trait ContractInterface{
    fn add_email(email: String, ankaddress: String);
    fn check_email(email: String) -> PrivacyInfo;
}

// Implementation of the public-facing secret contract functions defined in the ContractInterface
// trait implementation for the Contract struct above
impl ContractInterface for Contract {
    #[no_mangle]
    fn add_email(email: String, ankaddress: String) {
        let mut emails = Self::get_emails();
        emails.push(PrivacyInfo {
            email,
            ankaddress,
        });
        write_state!(PRIVACYINFO => emails);
    }

    #[no_mangle]
    fn check_email(email: String) -> PrivacyInfo {
        let mut emails = Self::get_emails();
        let index = emails.iter().position(|&r| r.email == email).unwrap();
        emails(index)
    }

}
