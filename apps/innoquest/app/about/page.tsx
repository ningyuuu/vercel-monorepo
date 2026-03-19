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
                    <td className="p-2">Glucose</td>
                    <td className="p-2">Glucose Tolerance Test</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">
                      Urine Microalbumin / Creatinine Ratio
                    </td>
                    <td className="p-2">Urine Microalb/Cre Ratio</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Urine Microalbumin/Creatinine Ratio</td>
                    <td className="p-2">Urine Microalb/Cre Ratio</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">APTT (PTT)</td>
                    <td className="p-2">APTT</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Cocoa F93</td>
                    <td className="p-2">Cacao (Cocoa) F93</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">C4 Complement</td>
                    <td className="p-2">Complement C4</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">C3 Complement</td>
                    <td className="p-2">Complement C3</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">ESR</td>
                    <td className="p-2">Erythrocyte Sedimentation Rate</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">LDH</td>
                    <td className="p-2">LDH, Lactate Dehydrogenase</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">eGFR</td>
                    <td className="p-2">
                      eGFR (Estimated Glomerular Filtration Rate)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">CMV IgG Antibody</td>
                    <td className="p-2">
                      Cytomegalovirus IgG Antibody (CMV IgG)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">EBV EA-IgA</td>
                    <td className="p-2">Epstein Barr Virus - EA-IgA</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Hb Electrophoresis</td>
                    <td className="p-2">Haemoglobin Electrophoresis</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">ABO Blood Group</td>
                    <td className="p-2">Blood Group</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">HE4</td>
                    <td className="p-2">Human Epididymis Protein 4</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Total Cholesterol</td>
                    <td className="p-2">Cholesterol, Total</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Total Protein</td>
                    <td className="p-2">Protein, Total</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Total Bilirubin</td>
                    <td className="p-2">Bilirubin, Total</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Free Androgen Index (FAI)</td>
                    <td className="p-2">Free Androgen Index</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Free T3</td>
                    <td className="p-2">Free T3 (FT3)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Free T4</td>
                    <td className="p-2">Free T4 (FT4)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Intact Parathyroid Hormone (iPTH)</td>
                    <td className="p-2">Parathyroid Hormone (iPTH)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Total Iron Binding Capacity (TIBC)</td>
                    <td className="p-2">
                      Iron Binding Capacity (TIBC), including Transferrin
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Bilirubin, Direct</td>
                    <td className="p-2">Direct Bilirubin, Conjugated</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Bilirubin, Indirect</td>
                    <td className="p-2">Indirect Bilirubin, Unconjugated</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Thrombin Clotting Time (TCT)</td>
                    <td className="p-2">Thrombin Clotting Time</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Folic Acid</td>
                    <td className="p-2">Folic Acid, Serum</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Cortisol</td>
                    <td className="p-2">Cortisol (Blood)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Insulin</td>
                    <td className="p-2">Insulin (Fasting)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Insulin like Growth Factor (IGF1)</td>
                    <td className="p-2">
                      Insulin-like Growth Factor 1 (IGF-1)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Monospot Test</td>
                    <td className="p-2">Monospot (Infectious Mononucleosis)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Hepatitis A Total Antibody</td>
                    <td className="p-2">
                      Hepatitis A Total Antibody (HAV Total)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Hepatitis Bc Antibody</td>
                    <td className="p-2">Hepatitis B Core Total Antibody</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Dengue NS1 Antigen</td>
                    <td className="p-2">Dengue Antigen (NS1 Antigen)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Dengue Antibody IgG & IgM</td>
                    <td className="p-2">Dengue IgG & IgM Ab</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Dengue IgG & IgM Antibodies</td>
                    <td className="p-2">Dengue IgG & IgM Ab</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">
                      Squamous Cell Carcinoma Antigen (SCC Ag)
                    </td>
                    <td className="p-2">Squamous Cell Carcinoma Antigen</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Neisseria Gonorrhoea</td>
                    <td className="p-2">Neisseria Gonorrhoeae</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Penicillium Notatum M1</td>
                    <td className="p-2">Penicillium Notatum HM1</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Rheumatoid Factor</td>
                    <td className="p-2">Rheumatoid Factor (RF)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Testosterone</td>
                    <td className="p-2">Testosterone, Total</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Anti-HCV Antibody</td>
                    <td className="p-2">Hepatitis C Antibody (HCV)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Anti-Nuclear Factor (ANF)</td>
                    <td className="p-2">
                      Anti Nuclear Factor (ANF) (Immunofluorescence with Titre)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Anti-Nuclear Antibody</td>
                    <td className="p-2">
                      Anti Nuclear Factor (ANF) (Immunofluorescence with Titre)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Alkaline Phosphatase, Heat Stable</td>
                    <td className="p-2">
                      Alkaline Phosphatase Isoenzyme (Fractionation) Heat Stable
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Dust - Greer H1</td>
                    <td className="p-2">Greer labs House Dust HAH1</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">RPR & TPLA</td>
                    <td className="p-2">TPLA</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Vitamin D, Total</td>
                    <td className="p-2">
                      Total Vitamin D (With D2 & D3 Readings)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Herpes Simplex Virus Type I IgG</td>
                    <td className="p-2">Herpes Simplex Type 1 IgG</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">
                      Herpes Simplex Virus Type I IgG Antibody
                    </td>
                    <td className="p-2">Herpes Simplex Type 1 IgG</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Herpes Simplex Virus Type II IgG</td>
                    <td className="p-2">Herpes Simplex Type 2 IgG</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">
                      Herpes Simplex Virus Type II IgG Antibody
                    </td>
                    <td className="p-2">Herpes Simplex Type 2 IgG</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Troponin I, high sensitive</td>
                    <td className="p-2">High Sensitive Troponin-I</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Troponin T, high sensitive</td>
                    <td className="p-2">High Sensitive Troponin-T</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">D. Farinae D2</td>
                    <td className="p-2">Dermatophagoides Farinae D2</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">D. Pteronyssinus D1</td>
                    <td className="p-2">Dermatophagoides Pteronyssinus D1</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">
                      Dehydroepiandrosterone Sulfate (DHEAS)
                    </td>
                    <td className="p-2">
                      Dehyroepiandrosterone Sulfate (DHEAS)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">
                      VP3 (Candida albicans/Candida others, Gardnerella
                      vaginalis, Trichomonas vaginalis)
                    </td>
                    <td className="p-2">
                      DNA Probe/Multiplex Real Time PCR for Vaginitis (VP3)
                    </td>
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
