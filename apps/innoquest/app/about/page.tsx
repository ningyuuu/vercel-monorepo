import { Navbar } from "@/components/Navbar";
import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";

export default function About() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl bg-transparent px-6 pb-8 pt-16 sm:pt-16">
        <Navbar
          title="Innoquest - 2026 Test Profiles"
          actions={
            <ThemeToggle className="static right-auto top-auto z-auto" />
          }
        />
        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">
              Important Information
            </h2>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              This database is not built by a medical professional, but as a
              hobby project for convenience. Hence, no information on this page
              should serve as medical advice. When in doubt, users should always
              refer to the source of truth for the most updated information, and
              verify that information is correct.
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              About This Application
            </h2>
            <p className="text-sm text-muted-foreground">
              This application provides a searchable database of medical test
              profiles and individual tests from Innoquest Singapore, retrieved
              from the 2026 Test Menu. The data is sourced from the{" "}
              <a
                href="https://www.innoquest.com.sg/test-menu/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Innoquest website&apos;s PDF
              </a>
              . For any queries or suggestions, please feel free to{" "}
              <a className="underline" href="mailto:ningyu321@gmail.com">
                contact me through email
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              Data cleaning methodology
            </h2>
            <p className="text-sm text-muted-foreground pb-2">
              The data was extracted from the PDF using a combination of
              automated tools and manual cleaning. Data extraction was
              facilitated with LLMs, and the resulting data was placed into
              tables.
            </p>
            <p className="text-sm text-muted-foreground">
              While test profiles are meant to comprise of individual tests, the
              individual tests table did not always align perfectly with the
              profiles. This discrepancy was addressed with the following
              adjustments:
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm text-muted-foreground border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold">Issue</th>
                    <th className="text-left p-2 font-semibold">Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">
                      Comments for specific test items (e.g. only for female
                      patients)
                    </td>
                    <td className="p-2">
                      Moved these comments to a remarks column.
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Discrepancies in test names</td>
                    <td className="p-2">
                      Test names are corrected to match names in individual
                      tests&apos; list. For full list of adjustments, refer to
                      table below.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      Missing individual tests (in particular for drug tests)
                    </td>
                    <td className="p-2">
                      No action - these tests are not added as individual tests
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              Full list of test names&apos; corrections
            </h2>

            <p className="text-sm text-muted-foreground pb-2">
              Tests listed in profiles are adjusted to match names in the
              individual tests table, to ensure consistency and better
              searching.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm text-muted-foreground border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold">
                      Original Name
                    </th>
                    <th className="text-left p-2 font-semibold">
                      Adjusted Name (matching individual tests)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Free T3</td>
                    <td className="p-2">Free T3 (FT3)</td>
                    {/* "Glucose": "Glucose Tolerance Test", "Urine Microalbumin
                    / Creatinine Ratio": "Urine Microalb/Cre Ratio", "Urine
                    Microalbumin/Creatinine Ratio": "Urine Microalb/Cre Ratio",
                    "APTT (PTT)": "APTT", "Cocoa F93": "Cacao (Cocoa) F93", "C4
                    Complement": "Complement C4", "C3 Complement": "Complement
                    C3", # --- abbreviations / short forms --- "ESR":
                    "Erythrocyte Sedimentation Rate", "LDH": "LDH, Lactate
                    Dehydrogenase", "eGFR": "eGFR (Estimated Glomerular
                    Filtration Rate)", "CMV IgG Antibody": "Cytomegalovirus IgG
                    Antibody (CMV IgG)", "EBV EA-IgA": "Epstein Barr Virus -
                    EA-IgA", "Hb Electrophoresis": "Haemoglobin
                    Electrophoresis", "ABO Blood Group": "Blood Group", "HE4":
                    "Human Epididymis Protein 4", # --- word order / punctuation
                    differences --- "Total Cholesterol": "Cholesterol, Total",
                    "Total Protein": "Protein, Total", "Total Bilirubin":
                    "Bilirubin, Total", "Free Androgen Index (FAI)": "Free
                    Androgen Index", "Free T3": "Free T3 (FT3)", "Free T4":
                    "Free T4 (FT4)", "Intact Parathyroid Hormone (iPTH)":
                    "Parathyroid Hormone (iPTH)", "Total Iron Binding Capacity
                    (TIBC)": "Iron Binding Capacity (TIBC), including
                    Transferrin", "Bilirubin, Direct": "Direct Bilirubin,
                    Conjugated", "Bilirubin, Indirect": "Indirect Bilirubin,
                    Unconjugated", "Thrombin Clotting Time (TCT)": "Thrombin
                    Clotting Time", # --- suffix / specificity differences ---
                    "Folic Acid": "Folic Acid, Serum", "Cortisol": "Cortisol
                    (Blood)", "Insulin": "Insulin (Fasting)", "Insulin like
                    Growth Factor (IGF1)": "Insulin-like Growth Factor 1
                    (IGF-1)", "Monospot Test": "Monospot (Infectious
                    Mononucleosis)", "Hepatitis A Total Antibody": "Hepatitis A
                    Total Antibody (HAV Total)", "Hepatitis Bc Antibody":
                    "Hepatitis B Core Total Antibody", "Dengue NS1 Antigen":
                    "Dengue Antigen (NS1 Antigen)", "Dengue Antibody IgG & IgM":
                    "Dengue IgG & IgM Ab", "Dengue IgG & IgM Antibodies":
                    "Dengue IgG & IgM Ab", "Squamous Cell Carcinoma Antigen (SCC
                    Ag)": "Squamous Cell Carcinoma Antigen", "Neisseria
                    Gonorrhoea": "Neisseria Gonorrhoeae", # spelling variant
                    "Penicillium Notatum M1": "Penicillium Notatum HM1", # M1 vs
                    HM1 "Rheumatoid Factor": "Rheumatoid Factor (RF)",
                    "Testosterone": "Testosterone, Total", "Anti-HCV Antibody":
                    "Hepatitis C Antibody (HCV)", "Anti-Nuclear Factor (ANF)":
                    "Anti Nuclear Factor (ANF) (Immunofluorescence with Titre)",
                    "Anti-Nuclear Antibody": "Anti Nuclear Factor (ANF)
                    (Immunofluorescence with Titre)", "Alkaline Phosphatase,
                    Heat Stable": "Alkaline Phosphatase Isoenzyme
                    (Fractionation) Heat Stable", "Dust - Greer H1": "Greer labs
                    House Dust HAH1", "RPR & TPLA": "TPLA", "Vitamin D, Total":
                    "Total Vitamin D (With D2 & D3 Readings)", # --- "Herpes
                    Simplex Virus Type I/II IgG" → canonical without "Virus" and
                    roman→arabic --- "Herpes Simplex Virus Type I IgG": "Herpes
                    Simplex Type 1 IgG", "Herpes Simplex Virus Type I IgG
                    Antibody": "Herpes Simplex Type 1 IgG", "Herpes Simplex
                    Virus Type II IgG": "Herpes Simplex Type 2 IgG", "Herpes
                    Simplex Virus Type II IgG Antibody": "Herpes Simplex Type 2
                    IgG", # --- Troponin: word order flipped --- "Troponin I,
                    high sensitive": "High Sensitive Troponin-I", "Troponin T,
                    high sensitive": "High Sensitive Troponin-T", # --- dust
                    mite abbreviations --- "D. Farinae D2": "Dermatophagoides
                    Farinae D2", "D. Pteronyssinus D1": "Dermatophagoides
                    Pteronyssinus D1", # --- DHEAS typo in single list ("Dehyro"
                    vs "Dehydro") --- "Dehydroepiandrosterone Sulfate (DHEAS)":
                    "Dehyroepiandrosterone Sulfate (DHEAS)", # --- VP3 long
                    description → canonical --- "VP3 (Candida albicans/Candida
                    others, Gardnerella vaginalis, Trichomonas vaginalis)": "DNA
                    Probe/Multiplex Real Time PCR for Vaginitis (VP3)", */}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
