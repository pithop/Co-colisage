export interface WorldCity {
  name: string;
  asciiName: string;
  country: string;
  countryCode: string;
  region: "France" | "Maghreb" | "Europe" | "Afrique" | "Amériques" | "Moyen-Orient" | "Asie" | "Océanie";
  code?: string;
  popular?: boolean;
}

export const worldCities: WorldCity[] = [
  // --- France ---
  { name: "Paris", asciiName: "Paris", country: "France", countryCode: "FR", region: "France", code: "CDG", popular: true },
  { name: "Paris Orly", asciiName: "Paris Orly", country: "France", countryCode: "FR", region: "France", code: "ORY", popular: true },
  { name: "Marseille", asciiName: "Marseille", country: "France", countryCode: "FR", region: "France", code: "MRS", popular: true },
  { name: "Lyon", asciiName: "Lyon", country: "France", countryCode: "FR", region: "France", code: "LYS", popular: true },
  { name: "Toulouse", asciiName: "Toulouse", country: "France", countryCode: "FR", region: "France", code: "TLS", popular: true },
  { name: "Nice", asciiName: "Nice", country: "France", countryCode: "FR", region: "France", code: "NCE", popular: true },
  { name: "Nantes", asciiName: "Nantes", country: "France", countryCode: "FR", region: "France", code: "NTE", popular: true },
  { name: "Bordeaux", asciiName: "Bordeaux", country: "France", countryCode: "FR", region: "France", code: "BOD", popular: true },
  { name: "Lille", asciiName: "Lille", country: "France", countryCode: "FR", region: "France", code: "LIL", popular: true },
  { name: "Strasbourg", asciiName: "Strasbourg", country: "France", countryCode: "FR", region: "France", code: "SXB", popular: true },
  { name: "Montpellier", asciiName: "Montpellier", country: "France", countryCode: "FR", region: "France", code: "MPL", popular: true },
  { name: "Rennes", asciiName: "Rennes", country: "France", countryCode: "FR", region: "France", code: "RNS" },
  { name: "Reims", asciiName: "Reims", country: "France", countryCode: "FR", region: "France" },
  { name: "Saint-Étienne", asciiName: "Saint-Etienne", country: "France", countryCode: "FR", region: "France" },
  { name: "Toulon", asciiName: "Toulon", country: "France", countryCode: "FR", region: "France", code: "TLN" },
  { name: "Grenoble", asciiName: "Grenoble", country: "France", countryCode: "FR", region: "France", code: "GNB" },
  { name: "Dijon", asciiName: "Dijon", country: "France", countryCode: "FR", region: "France" },
  { name: "Angers", asciiName: "Angers", country: "France", countryCode: "FR", region: "France" },
  { name: "Nîmes", asciiName: "Nimes", country: "France", countryCode: "FR", region: "France", code: "FNI" },
  { name: "Clermont-Ferrand", asciiName: "Clermont-Ferrand", country: "France", countryCode: "FR", region: "France", code: "CFE" },
  { name: "Aix-en-Provence", asciiName: "Aix-en-Provence", country: "France", countryCode: "FR", region: "France" },
  { name: "Brest", asciiName: "Brest", country: "France", countryCode: "FR", region: "France", code: "BES" },
  { name: "Tours", asciiName: "Tours", country: "France", countryCode: "FR", region: "France", code: "TUF" },
  { name: "Amiens", asciiName: "Amiens", country: "France", countryCode: "FR", region: "France" },
  { name: "Limoges", asciiName: "Limoges", country: "France", countryCode: "FR", region: "France", code: "LIG" },
  { name: "Annecy", asciiName: "Annecy", country: "France", countryCode: "FR", region: "France", code: "NCY" },
  { name: "Perpignan", asciiName: "Perpignan", country: "France", countryCode: "FR", region: "France", code: "PGF" },
  { name: "Metz", asciiName: "Metz", country: "France", countryCode: "FR", region: "France", code: "ETZ" },
  { name: "Besançon", asciiName: "Besancon", country: "France", countryCode: "FR", region: "France" },
  { name: "Orléans", asciiName: "Orleans", country: "France", countryCode: "FR", region: "France" },
  { name: "Rouen", asciiName: "Rouen", country: "France", countryCode: "FR", region: "France" },
  { name: "Mulhouse", asciiName: "Mulhouse", country: "France", countryCode: "FR", region: "France", code: "MLH" },
  { name: "Caen", asciiName: "Caen", country: "France", countryCode: "FR", region: "France", code: "CFR" },
  { name: "Nancy", asciiName: "Nancy", country: "France", countryCode: "FR", region: "France" },
  { name: "Avignon", asciiName: "Avignon", country: "France", countryCode: "FR", region: "France", code: "AVN" },
  { name: "Poitiers", asciiName: "Poitiers", country: "France", countryCode: "FR", region: "France", code: "PIS" },
  { name: "Pau", asciiName: "Pau", country: "France", countryCode: "FR", region: "France", code: "PUF" },
  { name: "La Rochelle", asciiName: "La Rochelle", country: "France", countryCode: "FR", region: "France", code: "LRH" },
  { name: "Ajaccio", asciiName: "Ajaccio", country: "France", countryCode: "FR", region: "France", code: "AJA" },
  { name: "Bastia", asciiName: "Bastia", country: "France", countryCode: "FR", region: "France", code: "BIA" },

  // --- Algérie ---
  { name: "Alger", asciiName: "Alger", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "ALG", popular: true },
  { name: "Oran", asciiName: "Oran", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "ORN", popular: true },
  { name: "Constantine", asciiName: "Constantine", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "CZL", popular: true },
  { name: "Annaba", asciiName: "Annaba", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "AAE", popular: true },
  { name: "Sétif", asciiName: "Setif", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "QSF", popular: true },
  { name: "Batna", asciiName: "Batna", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "BLJ" },
  { name: "Tlemcen", asciiName: "Tlemcen", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "TLM", popular: true },
  { name: "Béjaïa", asciiName: "Bejaia", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "BJA", popular: true },
  { name: "Biskra", asciiName: "Biskra", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "BSK" },
  { name: "Blida", asciiName: "Blida", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Chlef", asciiName: "Chlef", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "CFK" },
  { name: "Djelfa", asciiName: "Djelfa", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Sidi Bel Abbès", asciiName: "Sidi Bel Abbes", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Mostaganem", asciiName: "Mostaganem", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Tiaret", asciiName: "Tiaret", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "TID" },
  { name: "Tébessa", asciiName: "Tebessa", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "TEE" },
  { name: "Skikda", asciiName: "Skikda", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Tizi Ouzou", asciiName: "Tizi Ouzou", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Bordj Bou Arreridj", asciiName: "Bordj Bou Arreridj", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Ouargla", asciiName: "Ouargla", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "OGX" },
  { name: "Ghardaïa", asciiName: "Ghardaia", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "GHA" },
  { name: "Médéa", asciiName: "Medea", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Béchar", asciiName: "Bechar", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "CBH" },
  { name: "El Oued", asciiName: "El Oued", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "ELU" },
  { name: "Guelma", asciiName: "Guelma", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Jijel", asciiName: "Jijel", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "GJL" },
  { name: "Souk Ahras", asciiName: "Souk Ahras", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Tipaza", asciiName: "Tipaza", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Boumerdès", asciiName: "Boumerdes", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Laghouat", asciiName: "Laghouat", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "LOO" },
  { name: "Mascara", asciiName: "Mascara", country: "Algérie", countryCode: "DZ", region: "Maghreb" },
  { name: "Hassi Messaoud", asciiName: "Hassi Messaoud", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "HME" },
  { name: "Tamanrasset", asciiName: "Tamanrasset", country: "Algérie", countryCode: "DZ", region: "Maghreb", code: "TMR" },

  // --- Maroc ---
  { name: "Casablanca", asciiName: "Casablanca", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "CMN", popular: true },
  { name: "Rabat", asciiName: "Rabat", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "RBA", popular: true },
  { name: "Marrakech", asciiName: "Marrakech", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "RAK", popular: true },
  { name: "Fès", asciiName: "Fes", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "FEZ", popular: true },
  { name: "Tanger", asciiName: "Tanger", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "TNG", popular: true },
  { name: "Agadir", asciiName: "Agadir", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "AGA", popular: true },
  { name: "Meknès", asciiName: "Meknes", country: "Maroc", countryCode: "MA", region: "Maghreb" },
  { name: "Oujda", asciiName: "Oujda", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "OUD" },
  { name: "Kénitra", asciiName: "Kenitra", country: "Maroc", countryCode: "MA", region: "Maghreb" },
  { name: "Tétouan", asciiName: "Tetouan", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "TTU" },
  { name: "Nador", asciiName: "Nador", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "NDR" },
  { name: "Essaouira", asciiName: "Essaouira", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "ESU" },
  { name: "Dakhla", asciiName: "Dakhla", country: "Maroc", countryCode: "MA", region: "Maghreb", code: "VIL" },

  // --- Tunisie ---
  { name: "Tunis", asciiName: "Tunis", country: "Tunisie", countryCode: "TN", region: "Maghreb", code: "TUN", popular: true },
  { name: "Sfax", asciiName: "Sfax", country: "Tunisie", countryCode: "TN", region: "Maghreb", code: "SFA", popular: true },
  { name: "Sousse", asciiName: "Sousse", country: "Tunisie", countryCode: "TN", region: "Maghreb" },
  { name: "Djerba", asciiName: "Djerba", country: "Tunisie", countryCode: "TN", region: "Maghreb", code: "DJE", popular: true },
  { name: "Monastir", asciiName: "Monastir", country: "Tunisie", countryCode: "TN", region: "Maghreb", code: "MIR" },
  { name: "Bizerte", asciiName: "Bizerte", country: "Tunisie", countryCode: "TN", region: "Maghreb" },
  { name: "Gabès", asciiName: "Gabes", country: "Tunisie", countryCode: "TN", region: "Maghreb", code: "GAE" },
  { name: "Tozeur", asciiName: "Tozeur", country: "Tunisie", countryCode: "TN", region: "Maghreb", code: "TOE" },

  // --- Égypte & Libye ---
  { name: "Le Caire", asciiName: "Le Caire", country: "Égypte", countryCode: "EG", region: "Afrique", code: "CAI", popular: true },
  { name: "Alexandrie", asciiName: "Alexandrie", country: "Égypte", countryCode: "EG", region: "Afrique", code: "HBE" },
  { name: "Charm el-Cheikh", asciiName: "Charm el-Cheikh", country: "Égypte", countryCode: "EG", region: "Afrique", code: "SSH" },
  { name: "Tripoli", asciiName: "Tripoli", country: "Libye", countryCode: "LY", region: "Afrique", code: "TIP" },
  { name: "Benghazi", asciiName: "Benghazi", country: "Libye", countryCode: "LY", region: "Afrique", code: "BEN" },

  // --- Afrique Subsaharienne ---
  { name: "Dakar", asciiName: "Dakar", country: "Sénégal", countryCode: "SN", region: "Afrique", code: "DSS", popular: true },
  { name: "Abidjan", asciiName: "Abidjan", country: "Côte d'Ivoire", countryCode: "CI", region: "Afrique", code: "ABJ", popular: true },
  { name: "Bamako", asciiName: "Bamako", country: "Mali", countryCode: "ML", region: "Afrique", code: "BKO" },
  { name: "Conakry", asciiName: "Conakry", country: "Guinée", countryCode: "GN", region: "Afrique", code: "CKY" },
  { name: "Lomé", asciiName: "Lome", country: "Togo", countryCode: "TG", region: "Afrique", code: "LFW" },
  { name: "Cotonou", asciiName: "Cotonou", country: "Bénin", countryCode: "BJ", region: "Afrique", code: "COO" },
  { name: "Douala", asciiName: "Douala", country: "Cameroun", countryCode: "CM", region: "Afrique", code: "DLA" },
  { name: "Yaoundé", asciiName: "Yaounde", country: "Cameroun", countryCode: "CM", region: "Afrique", code: "NSI" },
  { name: "Libreville", asciiName: "Libreville", country: "Gabon", countryCode: "GA", region: "Afrique", code: "LBV" },
  { name: "Brazzaville", asciiName: "Brazzaville", country: "Congo", countryCode: "CG", region: "Afrique", code: "BZV" },
  { name: "Kinshasa", asciiName: "Kinshasa", country: "RDC", countryCode: "CD", region: "Afrique", code: "FIH" },
  { name: "Luanda", asciiName: "Luanda", country: "Angola", countryCode: "AO", region: "Afrique", code: "LAD" },
  { name: "Lagos", asciiName: "Lagos", country: "Nigeria", countryCode: "NG", region: "Afrique", code: "LOS", popular: true },
  { name: "Abuja", asciiName: "Abuja", country: "Nigeria", countryCode: "NG", region: "Afrique", code: "ABV" },
  { name: "Accra", asciiName: "Accra", country: "Ghana", countryCode: "GH", region: "Afrique", code: "ACC" },
  { name: "Nairobi", asciiName: "Nairobi", country: "Kenya", countryCode: "KE", region: "Afrique", code: "NBO", popular: true },
  { name: "Addis-Abeba", asciiName: "Addis-Abeba", country: "Éthiopie", countryCode: "ET", region: "Afrique", code: "ADD" },
  { name: "Kigali", asciiName: "Kigali", country: "Rwanda", countryCode: "RW", region: "Afrique", code: "KGL" },
  { name: "Johannesburg", asciiName: "Johannesburg", country: "Afrique du Sud", countryCode: "ZA", region: "Afrique", code: "JNB", popular: true },
  { name: "Le Cap", asciiName: "Le Cap", country: "Afrique du Sud", countryCode: "ZA", region: "Afrique", code: "CPT" },
  { name: "Port-Louis", asciiName: "Port-Louis", country: "Maurice", countryCode: "MU", region: "Afrique", code: "MRU" },
  { name: "Antananarivo", asciiName: "Antananarivo", country: "Madagascar", countryCode: "MG", region: "Afrique", code: "TNR" },

  // --- Europe ---
  { name: "Bruxelles", asciiName: "Bruxelles", country: "Belgique", countryCode: "BE", region: "Europe", code: "BRU", popular: true },
  { name: "Liège", asciiName: "Liege", country: "Belgique", countryCode: "BE", region: "Europe", code: "LGG" },
  { name: "Genève", asciiName: "Geneve", country: "Suisse", countryCode: "CH", region: "Europe", code: "GVA", popular: true },
  { name: "Zurich", asciiName: "Zurich", country: "Suisse", countryCode: "CH", region: "Europe", code: "ZRH", popular: true },
  { name: "Bâle", asciiName: "Bale", country: "Suisse", countryCode: "CH", region: "Europe", code: "BSL" },
  { name: "Londres", asciiName: "Londres", country: "Royaume-Uni", countryCode: "GB", region: "Europe", code: "LHR", popular: true },
  { name: "Manchester", asciiName: "Manchester", country: "Royaume-Uni", countryCode: "GB", region: "Europe", code: "MAN" },
  { name: "Madrid", asciiName: "Madrid", country: "Espagne", countryCode: "ES", region: "Europe", code: "MAD", popular: true },
  { name: "Barcelone", asciiName: "Barcelone", country: "Espagne", countryCode: "ES", region: "Europe", code: "BCN", popular: true },
  { name: "Valence", asciiName: "Valence", country: "Espagne", countryCode: "ES", region: "Europe", code: "VLC" },
  { name: "Séville", asciiName: "Seville", country: "Espagne", countryCode: "ES", region: "Europe", code: "SVQ" },
  { name: "Malaga", asciiName: "Malaga", country: "Espagne", countryCode: "ES", region: "Europe", code: "AGP" },
  { name: "Rome", asciiName: "Rome", country: "Italie", countryCode: "IT", region: "Europe", code: "FCO", popular: true },
  { name: "Milan", asciiName: "Milan", country: "Italie", countryCode: "IT", region: "Europe", code: "MXP", popular: true },
  { name: "Naples", asciiName: "Naples", country: "Italie", countryCode: "IT", region: "Europe", code: "NAP" },
  { name: "Turin", asciiName: "Turin", country: "Italie", countryCode: "IT", region: "Europe", code: "TRN" },
  { name: "Berlin", asciiName: "Berlin", country: "Allemagne", countryCode: "DE", region: "Europe", code: "BER", popular: true },
  { name: "Francfort", asciiName: "Francfort", country: "Allemagne", countryCode: "DE", region: "Europe", code: "FRA", popular: true },
  { name: "Munich", asciiName: "Munich", country: "Allemagne", countryCode: "DE", region: "Europe", code: "MUC", popular: true },
  { name: "Amsterdam", asciiName: "Amsterdam", country: "Pays-Bas", countryCode: "NL", region: "Europe", code: "AMS", popular: true },
  { name: "Lisbonne", asciiName: "Lisbonne", country: "Portugal", countryCode: "PT", region: "Europe", code: "LIS", popular: true },
  { name: "Porto", asciiName: "Porto", country: "Portugal", countryCode: "PT", region: "Europe", code: "OPO" },
  { name: "Vienne", asciiName: "Vienne", country: "Autriche", countryCode: "AT", region: "Europe", code: "VIE" },
  { name: "Dublin", asciiName: "Dublin", country: "Irlande", countryCode: "IE", region: "Europe", code: "DUB" },
  { name: "Athènes", asciiName: "Athenes", country: "Grèce", countryCode: "GR", region: "Europe", code: "ATH" },
  { name: "Istanbul", asciiName: "Istanbul", country: "Turquie", countryCode: "TR", region: "Europe", code: "IST", popular: true },
  { name: "Prague", asciiName: "Prague", country: "République Tchèque", countryCode: "CZ", region: "Europe", code: "PRG" },
  { name: "Varsovie", asciiName: "Varsovie", country: "Pologne", countryCode: "PL", region: "Europe", code: "WAW" },
  { name: "Budapest", asciiName: "Budapest", country: "Hongrie", countryCode: "HU", region: "Europe", code: "BUD" },
  { name: "Bucarest", asciiName: "Bucarest", country: "Roumanie", countryCode: "RO", region: "Europe", code: "OTP" },
  { name: "Copenhague", asciiName: "Copenhague", country: "Danemark", countryCode: "DK", region: "Europe", code: "CPH" },
  { name: "Stockholm", asciiName: "Stockholm", country: "Suède", countryCode: "SE", region: "Europe", code: "ARN" },
  { name: "Oslo", asciiName: "Oslo", country: "Norvège", countryCode: "NO", region: "Europe", code: "OSL" },
  { name: "Helsinki", asciiName: "Helsinki", country: "Finlande", countryCode: "FI", region: "Europe", code: "HEL" },

  // --- Amériques ---
  { name: "Montréal", asciiName: "Montreal", country: "Canada", countryCode: "CA", region: "Amériques", code: "YUL", popular: true },
  { name: "Québec", asciiName: "Quebec", country: "Canada", countryCode: "CA", region: "Amériques", code: "YQB" },
  { name: "Toronto", asciiName: "Toronto", country: "Canada", countryCode: "CA", region: "Amériques", code: "YYZ", popular: true },
  { name: "Vancouver", asciiName: "Vancouver", country: "Canada", countryCode: "CA", region: "Amériques", code: "YVR" },
  { name: "Ottawa", asciiName: "Ottawa", country: "Canada", countryCode: "CA", region: "Amériques", code: "YOW" },
  { name: "Calgary", asciiName: "Calgary", country: "Canada", countryCode: "CA", region: "Amériques", code: "YYC" },
  { name: "New York", asciiName: "New York", country: "États-Unis", countryCode: "US", region: "Amériques", code: "JFK", popular: true },
  { name: "Los Angeles", asciiName: "Los Angeles", country: "États-Unis", countryCode: "US", region: "Amériques", code: "LAX", popular: true },
  { name: "Miami", asciiName: "Miami", country: "États-Unis", countryCode: "US", region: "Amériques", code: "MIA", popular: true },
  { name: "Chicago", asciiName: "Chicago", country: "États-Unis", countryCode: "US", region: "Amériques", code: "ORD" },
  { name: "San Francisco", asciiName: "San Francisco", country: "États-Unis", countryCode: "US", region: "Amériques", code: "SFO" },
  { name: "Washington", asciiName: "Washington", country: "États-Unis", countryCode: "US", region: "Amériques", code: "IAD" },
  { name: "Boston", asciiName: "Boston", country: "États-Unis", countryCode: "US", region: "Amériques", code: "BOS" },
  { name: "Atlanta", asciiName: "Atlanta", country: "États-Unis", countryCode: "US", region: "Amériques", code: "ATL" },
  { name: "Houston", asciiName: "Houston", country: "États-Unis", countryCode: "US", region: "Amériques", code: "IAH" },
  { name: "Dallas", asciiName: "Dallas", country: "États-Unis", countryCode: "US", region: "Amériques", code: "DFW" },
  { name: "Mexico", asciiName: "Mexico", country: "Mexique", countryCode: "MX", region: "Amériques", code: "MEX", popular: true },
  { name: "Cancún", asciiName: "Cancun", country: "Mexique", countryCode: "MX", region: "Amériques", code: "CUN" },
  { name: "São Paulo", asciiName: "Sao Paulo", country: "Brésil", countryCode: "BR", region: "Amériques", code: "GRU", popular: true },
  { name: "Rio de Janeiro", asciiName: "Rio de Janeiro", country: "Brésil", countryCode: "BR", region: "Amériques", code: "GIG" },
  { name: "Buenos Aires", asciiName: "Buenos Aires", country: "Argentine", countryCode: "AR", region: "Amériques", code: "EZE", popular: true },
  { name: "Bogotá", asciiName: "Bogota", country: "Colombie", countryCode: "CO", region: "Amériques", code: "BOG" },
  { name: "Lima", asciiName: "Lima", country: "Pérou", countryCode: "PE", region: "Amériques", code: "LIM" },
  { name: "Santiago", asciiName: "Santiago", country: "Chili", countryCode: "CL", region: "Amériques", code: "SCL" },

  // --- Moyen-Orient ---
  { name: "Dubaï", asciiName: "Dubai", country: "Émirats Arabes Unis", countryCode: "AE", region: "Moyen-Orient", code: "DXB", popular: true },
  { name: "Abou Dabi", asciiName: "Abou Dabi", country: "Émirats Arabes Unis", countryCode: "AE", region: "Moyen-Orient", code: "AUH" },
  { name: "Doha", asciiName: "Doha", country: "Qatar", countryCode: "QA", region: "Moyen-Orient", code: "DOH", popular: true },
  { name: "Riyad", asciiName: "Riyad", country: "Arabie Saoudite", countryCode: "SA", region: "Moyen-Orient", code: "RUH", popular: true },
  { name: "Djeddah", asciiName: "Djeddah", country: "Arabie Saoudite", countryCode: "SA", region: "Moyen-Orient", code: "JED", popular: true },
  { name: "Médine", asciiName: "Medine", country: "Arabie Saoudite", countryCode: "SA", region: "Moyen-Orient", code: "MED" },
  { name: "Koweït", asciiName: "Koweit", country: "Koweït", countryCode: "KW", region: "Moyen-Orient", code: "KWI" },
  { name: "Mascate", asciiName: "Mascate", country: "Oman", countryCode: "OM", region: "Moyen-Orient", code: "MCT" },
  { name: "Manama", asciiName: "Manama", country: "Bahreïn", countryCode: "BH", region: "Moyen-Orient", code: "BAH" },
  { name: "Beyrouth", asciiName: "Beyrouth", country: "Liban", countryCode: "LB", region: "Moyen-Orient", code: "BEY", popular: true },
  { name: "Amman", asciiName: "Amman", country: "Jordanie", countryCode: "JO", region: "Moyen-Orient", code: "AMM" },

  // --- Asie & Océanie ---
  { name: "Tokyo", asciiName: "Tokyo", country: "Japon", countryCode: "JP", region: "Asie", code: "HND", popular: true },
  { name: "Osaka", asciiName: "Osaka", country: "Japon", countryCode: "JP", region: "Asie", code: "KIX" },
  { name: "Séoul", asciiName: "Seoul", country: "Corée du Sud", countryCode: "KR", region: "Asie", code: "ICN", popular: true },
  { name: "Pékin", asciiName: "Pekin", country: "Chine", countryCode: "CN", region: "Asie", code: "PEK" },
  { name: "Shanghai", asciiName: "Shanghai", country: "Chine", countryCode: "CN", region: "Asie", code: "PVG", popular: true },
  { name: "Hong Kong", asciiName: "Hong Kong", country: "Hong Kong", countryCode: "HK", region: "Asie", code: "HKG", popular: true },
  { name: "Singapour", asciiName: "Singapour", country: "Singapour", countryCode: "SG", region: "Asie", code: "SIN", popular: true },
  { name: "Bangkok", asciiName: "Bangkok", country: "Thaïlande", countryCode: "TH", region: "Asie", code: "BKK", popular: true },
  { name: "Kuala Lumpur", asciiName: "Kuala Lumpur", country: "Malaisie", countryCode: "MY", region: "Asie", code: "KUL" },
  { name: "Hanoï", asciiName: "Hanoi", country: "Vietnam", countryCode: "VN", region: "Asie", code: "HAN" },
  { name: "Hô Chi Minh-Ville", asciiName: "Ho Chi Minh-Ville", country: "Vietnam", countryCode: "VN", region: "Asie", code: "SGN" },
  { name: "Jakarta", asciiName: "Jakarta", country: "Indonésie", countryCode: "ID", region: "Asie", code: "CGK" },
  { name: "New Delhi", asciiName: "New Delhi", country: "Inde", countryCode: "IN", region: "Asie", code: "DEL", popular: true },
  { name: "Bombay", asciiName: "Bombay", country: "Inde", countryCode: "IN", region: "Asie", code: "BOM", popular: true },
  { name: "Sydney", asciiName: "Sydney", country: "Australie", countryCode: "AU", region: "Océanie", code: "SYD", popular: true },
  { name: "Melbourne", asciiName: "Melbourne", country: "Australie", countryCode: "AU", region: "Océanie", code: "MEL" },
  { name: "Auckland", asciiName: "Auckland", country: "Nouvelle-Zélande", countryCode: "NZ", region: "Océanie", code: "AKL" },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function searchWorldCities(query: string, limit = 8): WorldCity[] {
  const q = normalize(query);
  if (!q) {
    return worldCities.filter((c) => c.popular).slice(0, limit);
  }
  const startsWithMatches: WorldCity[] = [];
  const otherMatches: WorldCity[] = [];

  for (const city of worldCities) {
    const normName = normalize(city.name);
    const normAscii = normalize(city.asciiName);
    const normCountry = normalize(city.country);
    const code = city.code ? normalize(city.code) : "";

    if (normName.startsWith(q) || normAscii.startsWith(q) || code === q) {
      startsWithMatches.push(city);
    } else if (
      normName.includes(q) ||
      normAscii.includes(q) ||
      normCountry.includes(q) ||
      code.includes(q)
    ) {
      otherMatches.push(city);
    }

    if (startsWithMatches.length + otherMatches.length >= limit * 2) {
      break;
    }
  }

  return [...startsWithMatches, ...otherMatches].slice(0, limit);
}

export function findCityByName(name: string): WorldCity | undefined {
  const q = normalize(name);
  return worldCities.find(
    (c) => normalize(c.name) === q || normalize(c.asciiName) === q || (c.code && normalize(c.code) === q)
  );
}
