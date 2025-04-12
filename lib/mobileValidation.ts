import libphonenumber from "google-libphonenumber";
import { z } from "zod";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

export const phoneNumberSchema = z
  .string()
  .nonempty({ message: "Mobile number is required" })
  .refine(
    (number) => {
      try {
        const phoneNumber = phoneUtil.parse(`+213${number}`);

        return phoneUtil.isValidNumberForRegion(phoneNumber, "DZ");
      } catch (error) {
        return false;
      }
    },
    { message: "Invalid mobile number" }
  );
