const TILDA = 'https://static.tildacdn.com'

export const products = {
  arista: {
    slug: 'arista',
    brand: 'arista',
    brandName: 'Arista Biologicals',
    productType: 'Antibody',
    title: 'Mouse anti-Beta-LH Monoclonal Antibody, Clone 3',
    catalogNumber: 'ABBLH-0403',
    breadcrumbs: [
      { text: 'Home', link: '/' },
      { text: 'Products', link: '/products' },
      { text: 'Diagnostic Raw Materials', link: '/products/diagnostic-raw-materials' },
      { text: 'LFA Antibodies, Antigens & Gold Conjugates', link: '/products/lfa-antibodies' },
    ],
    skuStatusText: 'CustomCTA',
    customCTALabel: 'Request A Quote',
    ctaHref: '/contact-us',
    variants: [],
    gallery: [
      {
        src: `${TILDA}/tild3739-3838-4836-b864-363063356164/23.png`,
        alt: 'Pairing chart',
        title: 'Luteinizing hormone (LH) pairing matrix.',
        description:
          '<p>Pairing chart for capture and detection antibodies related to luteinizing hormone (LH).</p>',
      },
    ],
    shortDescription:
      '<p>Arista Biologicals Mouse anti-Beta-LH Monoclonal Antibody, Clone 3 (ABBLH-0403) is a mouse IgG1 monoclonal antibody for the detection of human luteinizing hormone (LH) in lateral flow immunoassays. It recognizes intact LH and its hormone-specific beta subunit, which distinguishes LH from the related glycoprotein hormones FSH, TSH, and hCG.</p><p>The antibody is supplied as a whole IgG purified by ion-exchange chromatography to ≥95% purity, and is designated for use as a detection antibody. It pairs with Arista anti-alpha LH antibodies for sandwich lateral flow formats.</p>',
    pairing: [
      { productCode: 'ABALH-0401', title: 'Mouse anti-Alpha LH Monoclonal Antibody' },
      { productCode: 'ABALH-0500', title: 'Goat anti-Alpha LH Antibody' },
      { productCode: 'ABBLH-0401', title: 'Mouse anti-Beta LH Monoclonal Antibody' },
    ],
    properties: {
      'tenant~web-category-list': ['Web Category', 'Primary Antibody'],
      'tenant~target': ['Target', 'LH beta subunit'],
      'tenant~host': ['Host', 'Mouse'],
      'tenant~clonality': ['Clonality', 'Monoclonal'],
      'tenant~clone': ['Clone', '3'],
      'tenant~immunogen': ['Immunogen', 'LH'],
      'tenant~iso-type': ['Isotype', 'IgG1'],
      'tenant~verified-reactivity': ['Verified Reactivity', 'Human'],
      'tenant~cross-reactivity': [
        'Cross Reactivity',
        'Does not cross-react with the alpha subunit of LH, hCG, TSH, or FSH.',
      ],
      'tenant~format': ['Format', 'Whole IgG'],
      'tenant~conjugate-type': ['Conjugate', 'Unconjugated'],
      'tenant~purification': ['Purification', 'Ion-exchange chromatography purified'],
      'tenant~purity': ['Purity', '≥95%'],
      'tenant~target-specificity': [
        'Target Specificity',
        'Recognizes intact LH and its beta-subunit',
      ],
      'tenant~antigen-species': ['Antigen Species', 'Human'],
      'tenant~gene-id': ['Gene ID', '3792'],
      'tenant~symbol': ['Gene Symbol', 'LHB'],
      'tenant~gene-name': ['Gene Name', 'luteinizing hormone beta polypeptide'],
      'tenant~uniprot-id': ['Uniprot ID', 'P01229'],
      'tenant~gene-aliases': ['Gene Aliases', 'CGB4; Hβ22; LSH-B; LSH-beta'],
      'tenant~assay-role': ['Assay Role', 'Detection'],
      'tenant~applications': ['Applications', 'LFA'],
      'tenant~buffer': ['Buffer', '10 mM PBS, 50 mM NaCl'],
      'tenant~preservative': ['Preservative', '0.05% Sodium Azide, pH 8.0'],
      'tenant~storage-variant': ['Storage', '2 - 8 °C'],
      'tenant~physical-state': ['Physical State', 'Liquid'],
      'tenant~shelf-life-variant': ['Shelf Life', '1 year from date of receipt'],
      'tenant~country-of-origin': ['Country of Origin', 'USA'],
      'tenant~use-statement': [
        'Use Statement',
        'Not for human, therapeutic, or in-vivo use. For research and further manufacturer use only.',
      ],
    },
    documents: [
      {
        id: 'ds',
        assettype: 'Datasheet',
        href: 'https://cdn.builder.io/o/assets%2Fce1ea832308e45d1a9079c87c4bdd80f%2F411b700fc328493b9f54efceb81c8bd5?alt=media&token=46998ada-8879-4887-acb6-81598f5d00fb&apiKey=ce1ea832308e45d1a9079c87c4bdd80f',
      },
      {
        id: 'coa',
        assettype: 'COA',
        href: 'https://cdn.builder.io/o/assets%2Fce1ea832308e45d1a9079c87c4bdd80f%2Fbcc1e75f7f9545f98930835760fb92a8?alt=media&token=45576c23-b871-4ce5-8a15-23767824a039&apiKey=ce1ea832308e45d1a9079c87c4bdd80f',
      },
      { id: 'sds', assettype: 'SDS', href: '#' },
    ],
    citations: null,
    related: [
      { productCode: 'ABALH-0403', title: 'Mouse anti-Alpha LH Monoclonal Antibody', brand: 'Arista Biologicals' },
      { productCode: 'ABALH-0500', title: 'Goat anti-Alpha LH Antibody', brand: 'Arista Biologicals' },
      { productCode: 'ABGAM-0500', title: 'Goat anti-Mouse IgG Antibody', brand: 'Arista Biologicals' },
      {
        productCode: 'CGBLH-0403',
        title: 'Mouse anti-Beta LH Monoclonal Antibody Colloidal Gold Conjugated',
        brand: 'Arista Biologicals',
      },
    ],
  },

  bethyl: {
    slug: 'bethyl',
    brand: 'bethyl',
    brandName: 'Bethyl Laboratories',
    productType: 'Antibody-Configurable',
    title: 'Rabbit anti-HdmX/MDM4 Recombinant Monoclonal Antibody [BL-3-2F2]',
    catalogNumber: 'A700-000',
    breadcrumbs: [
      { text: 'Home', link: '/' },
      { text: 'Products', link: '/products' },
      { text: 'Antibodies & Antigens', link: '/products/antibodies-antigens' },
      { text: 'Primary Antibodies', link: '/products/primary-antibodies' },
    ],
    skuStatusText: 'Active',
    inventoryMessage: 'Order within 3 hours and 12 minutes for same day shipment.',
    variants: [
      { value: '100ul', label: '100 µl', sku: 'A700-000', price: '$328.00' },
      { value: '20ul', label: '20 µl', sku: 'A700-000-T', price: '$136.00' },
    ],
    gallery: [
      {
        src: `${TILDA}/tild3263-6635-4464-b264-363462323833/Screenshot_2026-08-2.png`,
        alt: 'Western blot of HdmX/MDM4',
        title: 'Detection of human HdmX/MDM4 by western blot.',
        description:
          '<p><em>Samples:</em> Whole cell lysate (50 µg) from Jurkat, MCF-7, RKO, U2OS, and HEK293T cells prepared using NETN lysis buffer. <em>Antibody:</em> Rabbit anti-HdmX/MDM4 recombinant monoclonal antibody [BL-3-2F2] (A700-000 lot 4) used at 1:1000. <em>Secondary:</em> HRP-conjugated goat anti-rabbit IgG (A120-101P). <em>Detection:</em> Chemiluminescence with an exposure time of 75 seconds. Lower Panel: Rabbit anti-Actin recombinant monoclonal antibody [BLR057F] (A700-057).</p>',
      },
      {
        src: `${TILDA}/tild6536-3332-4334-b337-616666376233/Screenshot_2026-08-2.png`,
        alt: 'Flow cytometry of HdmX/MDM4 in Jurkat cells',
        title: 'Detection of human HdmX/MDM4 (shaded) in Jurkat cells by flow cytometry.',
        description:
          '<p><em>Antibody:</em> Rabbit anti-HdmX/MDM4 recombinant monoclonal [BL-3-2F2] (A700-000) or isotype control (unshaded). <em>Secondary:</em> DyLight® 488-conjugated goat anti-rabbit IgG (A120-101D2).</p>',
      },
      {
        src: `${TILDA}/tild6663-3332-4565-b536-393262346232/Screenshot_2026-08-2.png`,
        alt: 'Simple Western of HdmX/MDM4',
        title: 'Detection of human HdmX/MDM4 by Simple Western™.',
        description:
          '<p><em>Samples:</em> Whole cell lysate (0.4 mg/mL) from Jurkat cells prepared using NETN lysis buffer. <em>Antibody:</em> Rabbit anti-HdmX/MDM4 recombinant monoclonal antibody [BL-3-2F2] (A700-000) used at 1:10, 1:50, 1:250. <em>Separation and Detection:</em> SallySue ProteinSimple instrument with the 12–230 kDa separation module and anti-Rabbit detection module. Left Panel: Virtual Lane View. Right Panel: Electropherogram.</p>',
      },
      {
        src: `${TILDA}/tild6364-6534-4362-b731-643236393030/Screenshot_2026-08-2.png`,
        alt: 'Western blot of HdmX/MDM4 immunoprecipitates',
        title: 'Detection of human HdmX/MDM4 by western blot of immunoprecipitates.',
        description:
          '<p><em>Samples:</em> Whole cell lysate (1.0 mg per IP reaction; 20% of IP loaded) from Jurkat cells prepared using NETN lysis buffer. <em>Antibodies:</em> Rabbit anti-HdmX/MDM4 recombinant monoclonal antibody [BL-3-2F2] (A700-000 lot 4) used for IP at 20 µl/mg lysate. HdmX/MDM4 was also immunoprecipitated by a previous lot of this antibody (A700-000 lot 3) and a second antibody against a different epitope of HdmX/MDM4 (BL15229). For blotting immunoprecipitated HdmX/MDM4, A700-000 was used at 1:1000. <em>Detection:</em> Chemiluminescence with an exposure time of 10 seconds.</p>',
      },
    ],
    shortDescription:
      '<p>Bethyl Laboratories’ A700-000 is a recombinant rabbit monoclonal antibody for detection of human HdmX/MDM4. Clone BL-3-2F2 is a purified recombinant rabbit IgG produced from mammalian cells expressing the antibody. The antibody recognizes an epitope within residues 125–175 of human HdmX/MDM4, based on RefSeq NP_002384.2 (Gene ID 4194; UniProt O15151).</p><p>It has been validated for western blot, immunoprecipitation, flow cytometry, and Simple Western™ size-based assays.</p>',
    validationText:
      '<p>This antibody has been validated in-house using the following methods:</p><ul><li><strong>Western blot</strong> — specific band at the expected molecular weight in Jurkat, MCF-7, RKO, U2OS, and HEK293T lysates.</li><li><strong>Immunoprecipitation</strong> — enrichment of HdmX/MDM4 confirmed with an independent antibody against a different epitope.</li><li><strong>Flow cytometry</strong> — shift versus isotype control in fixed and permeabilized Jurkat cells.</li></ul>',
    properties: {
      'tenant~web-category-list': ['Web Category', 'Primary Antibody'],
      'tenant~clonality': ['Clonality', 'Recombinant Monoclonal'],
      'tenant~clone': ['Clone', 'BL-3-2F2'],
      'tenant~host': ['Host', 'Rabbit'],
      'tenant~immunogen': ['Immunogen', 'Between 125 and 175'],
      'tenant~iso-type': ['Isotype', 'IgG'],
      'tenant~verified-reactivity': ['Verified Reactivity', 'Human'],
      'tenant~format': ['Format', 'Whole IgG'],
      'tenant~conjugate-type': ['Conjugate', 'Unconjugated'],
      'tenant~purity': ['Purity', 'Purified'],
      'tenant~stock-concentration': ['Concentration', '100 µg/ml'],
      'tenant~target': ['Target', 'HdmX/MDM4'],
      'tenant~antigen-species': ['Antigen Species', 'Human'],
      'tenant~gene-id': ['Gene ID', '4194'],
      'tenant~symbol': ['Gene Symbol', 'MDM4'],
      'tenant~gene-name': ['Gene Name', 'MDM4, p53 regulator'],
      'tenant~uniprot-id': ['Uniprot ID', 'O15151'],
      'tenant~protein-name': ['Protein Name', 'Protein Mdm4'],
      'tenant~gene-aliases': [
        'Gene Aliases',
        'Double minute 4 protein; Double minute 4, human homolog of; HDMX; mdm2-like p53-binding protein; Mdm4 p53 binding protein homolog; MDM4 protein variant G; MDM4 protein variant Y; MDM4-related protein 1; MDMX; MRP1; p53-binding protein; p53-binding protein Mdm4; protein Mdm4; protein Mdmx',
      ],
      'tenant~applications-variant': ['Applications', 'WB, IP, Cytometry, SW-Size'],
      'tenant~buffer': ['Buffer', 'Borate Buffered Saline (BBS) pH 8.2'],
      'tenant~preservative': ['Preservative', '0.1% BSA and 0.09% Sodium Azide'],
      'tenant~storage-variant': ['Storage', '2 - 8 °C'],
      'tenant~physical-state': ['Physical State', 'Liquid'],
      'tenant~shelf-life-variant': ['Shelf Life', '1 year from date of receipt'],
      'tenant~country-of-origin': ['Country of Origin', 'USA'],
      'tenant~production-epitope': [
        'Production & Epitope',
        'Cell culture supernatant was harvested from mammalian cells expressing recombinant rabbit monoclonal antibody. The epitope recognized by A700-000 maps to a region between residues 125 and 175 of human ortholog of mouse double minute 4 using the numbering given in entry NP_002384.2 (GeneID 4194).',
      ],
      'tenant~application-text': [
        'Application Text',
        'All western blot analysis is performed using 5% Milk-TBST for blocking and as antibody diluent. Primary antibody is incubated overnight. Western blots of cell lysates are performed using Goat anti-Rabbit IgG Heavy and Light Chain Antibody (<strong>A120-101P</strong>). Western blots of immunoprecipitates are performed using an anti-Rabbit IgG Light Chain HRP-conjugated antibody with 5% Normal Pig Serum (Cat. No. <strong>S100-020</strong>) added to the blocking buffer.',
      ],
      'tenant~current-lot-variant': ['Current Lot', '4'],
    },
    dilutionRows: [
      { Application: 'Western Blot (WB)', ApplicationDilutionRange: '1:1000' },
      { Application: 'Immunoprecipitation (IP)', ApplicationDilutionRange: '20 µl / mg lysate' },
      {
        Application: 'Flow Cytometry',
        ApplicationDilutionRange:
          'Fixed and permeabilized cells were stained with 2 µl per 1 × 10⁶ cells.',
      },
      { Application: 'SW-Size', ApplicationDilutionRange: '1:10 - 1:250' },
    ],
    documents: [
      {
        id: 'ds',
        assettype: 'Datasheet',
        lot: '4',
        href: 'https://www.fortislife.com/cms/files/A700-000-4.pdf',
      },
      { id: 'sds', assettype: 'SDS', href: '#' },
    ],
    citations: [
      {
        title:
          'Inhibition of the mTOR pathway and reprogramming of protein synthesis by MDM4 reduce ovarian cancer metastatic properties.',
        meta: 'In Cell Death & Disease on 29 May 2021 by Lucà, R., Assenza, M. R., et al.',
        abstract:
          'Epithelial ovarian cancer (EOC) is a highly heterogeneous disease with a high death rate mainly due to the metastatic spread. The expression of MDM4, a well-known p53-inhibitor, is positively associated with chemotherapy response and overall survival (OS) in EOC. However, the basis of this association remains elusive. We show that in vivo MDM4 reduces intraperitoneal dissemination of EOC cells, independently of p53 and an immune-competent background.',
        tags: ['IP', 'Cancer Research'],
      },
      {
        title:
          'Cisplatin in Combination with MDM2 Inhibition Downregulates Rad51 Recombinase in a Bimodal Manner to Inhibit Homologous Recombination and Augment Tumor Cell Kill.',
        meta: 'In Molecular Pharmacology on 1 April 2020 by Xie, X., He, G., et al.',
        abstract:
          'Dysfunction of p53 and resistance to cancer drugs can arise through mutually exclusive overexpression of MDM2 or MDM4. Cisplatin-resistant cells, however, can demonstrate increased binding of both MDM2 and MDM4 to p53 but in absence of cellular overexpression. Whether MDM2 inhibitors alone can activate p53 in these resistant cells was investigated with the goal to establish the mechanism for potential synergy with cisplatin.',
        tags: ['Biochemistry and Molecular biology', 'Pharmacology', 'Cancer Research'],
      },
      {
        title:
          'High Mdm4 levels suppress p53 activity and enhance its half-life in acute myeloid leukaemia.',
        meta: 'In Oncotarget on 28 February 2014 by Tan, B. X., Khoo, K. H., et al.',
        abstract:
          'Although p53 is found mutated in almost 50% of all cancers, p53 mutations in leukaemia are relatively rare. Acute myeloid leukaemia (AML) cells employ other strategies to inactivate their wild type p53 (WTp53), like the overexpression of the p53 negative regulators Mdm2 and Mdm4.',
        tags: ['WB', 'Homo sapiens (Human)'],
      },
    ],
    related: [
      { productCode: 'A300-287A', title: 'HdmX/MDM4 Antibody', brand: 'Bethyl Laboratories' },
      {
        productCode: 'A120-101P',
        title: 'Goat anti-Rabbit IgG Heavy & Light Chain Antibody',
        brand: 'Bethyl Laboratories',
      },
      {
        productCode: 'A120-113P',
        title: 'Goat anti-Rabbit Light Chain HRP Conjugate',
        brand: 'Bethyl Laboratories',
      },
      { productCode: 'A303-379A', title: 'Rabbit anti-IRF2 Antibody', brand: 'Bethyl Laboratories' },
    ],
  },

  abcore: {
    slug: 'abcore',
    brand: 'abcore',
    brandName: 'AbCore',
    productType: 'Library',
    title: 'AbNano® Anti-NK-Cell VHH Library',
    catalogNumber: 'L770-200',
    breadcrumbs: [
      { text: 'Home', link: '/' },
      { text: 'Products', link: '/products' },
      { text: 'VHH Libraries', link: '/products/vhh-libraries' },
    ],
    skuStatusText: 'CustomCTA',
    customCTALabel: 'Request a Quote',
    ctaHref: '/contact-us',
    showPrices: false,
    variants: [{ value: '1ml', label: '1 ml', sku: 'L770-200', price: null }],
    gallery: [],
    shortDescription:
      '<p>The AbNano® VHH Anti-NK-Cell Library is a fully natural, single-domain VHH library generated from camelid immune-derived material and displayed on monovalent phage. Constructed from a single llama immunized with CD56-positive human NK cells, it is designed to support the discovery of VHH single-domain antibodies against NK-cell-associated targets.</p><p>The library has been characterized by next-generation sequencing, including V-gene representation, cluster density and frequency, and position-specific CDR composition.</p>',
    properties: {
      'tenant~web-category-list': ['Web Category', 'VHH Libraries'],
      'tenant~target': ['Target', 'NK Cells / NK-associated targets'],
      'tenant~applications': ['Applications', 'VHH Discovery & Affinity Selection'],
      'tenant~library-type': ['Library Type', 'Natural / Immune Derived'],
      'tenant~library-diversity': ['Library Diversity', '~1 × 10⁷ unique VHH sequences'],
      'tenant~format': ['Format', 'Monovalent Phage Display'],
      'tenant~host': ['Host', 'Llama'],
      'tenant~immunogen': ['Immunogen', 'CD56-positive human NK cells'],
      'tenant~cdr3-length': ['CDR3 Length', '5-30 amino acids'],
      'tenant~transformants': ['Transformants', '2.5 × 10⁹'],
      'tenant~ngs-reads': ['NGS Reads', '~1.1 million'],
      'tenant~in-frame-sequences': ['In-Frame Sequences', '79%'],
      'tenant~volume': ['Volume', '1 ml'],
      'tenant~stock-concentration': ['Concentration', '1 × 10¹¹ pfu/mL*'],
      'tenant~buffer': ['Buffer', 'PBS + 20% glycerol'],
      'tenant~iso-type': ['Isotype', 'VHH from llama and alpaca IgG2/IgG3'],
      'tenant~physical-state': ['Physical State', 'Frozen liquid'],
      'tenant~storage-variant': ['Storage', '−80°C'],
      'tenant~shelf-life-variant': ['Shelf Life', '1 year from date of receipt'],
      'tenant~country-of-origin': ['Country of Origin', 'USA'],
      'tenant~use-statement': ['Use Statement', 'Research Use Only'],
      'tenant~recommended-input': ['Recommended Input', '≥2.5 × 10¹⁰ pfu for panning rounds'],
      'tenant~selection-method': ['Selection Method', 'Phage display affinity selection'],
      'tenant~v-gene-representation': ['V-Gene Representation', 'NGS characterized'],
      'tenant~cluster-density-frequency': ['Cluster Density + Frequency', 'Characterized by NGS'],
      'tenant~cdr-composition': ['CDR Composition', 'Position-specific analysis'],
      'tenant~prodprocedures-1': [
        'Production',
        'Variable domains were isolated recombinantly and transformed as phagemid library. Phagemid were infected with M13KO7 filamentous bacteriophage. Secreted bacteriophage cultures were PEG-precipitated to high concentration, then normalized to 1E12 pfu/mL by titer dot assay. Centrifuge tube to remove product from lid. 2.5E10 pfu or more is advised for input panning rounds.',
      ],
      'tenant~application-text': [
        'Application Text',
        'Immuno-Oncology Research, NK-Cell Receptor Biology, CAR-NK &amp; Engineered NK-Cell Research, NK-Cell Target Discovery, NK-Cell Engager &amp; Multispecific Research, Biomarker &amp; Assay Development, Translational &amp; Preclinical Research',
      ],
    },
    documents: [
      { id: 'ds', assettype: 'Datasheet', href: '#' },
      { id: 'sds', assettype: 'SDS', href: '#' },
    ],
    citations: null,
    related: [
      { productCode: 'PLASMA-NVA', title: 'Naive Alpaca Plasma', brand: 'AbCore' },
      { productCode: 'PLASMA-NVL', title: 'Naive Llama Plasma', brand: 'AbCore' },
      { productCode: 'L760-100', title: 'AbNano® Anti-T-Cell VHH Library', brand: 'AbCore' },
      { productCode: 'L750-000', title: 'AbNano® VHH Naive Library', brand: 'AbCore' },
    ],
  },
}
