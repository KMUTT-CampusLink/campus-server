import prisma from "../../../core/db/prismaInstance.js"; // Adjust this path based on your project structure

const dup = [
  { id: 2000, book_id: 1041 },
  { id: 2001, book_id: 1041 },
  { id: 2002, book_id: 1041 },
  { id: 2003, book_id: 1042 },
  { id: 2004, book_id: 1042 },
  { id: 2005, book_id: 1042 },
  { id: 2006, book_id: 1043 },
  { id: 2007, book_id: 1043 },
  { id: 2008, book_id: 1043 },
  { id: 2009, book_id: 1044 },
  { id: 2010, book_id: 1044 },
  { id: 2011, book_id: 1044 },
  { id: 2012, book_id: 1045 },
  { id: 2013, book_id: 1045 },
  { id: 2014, book_id: 1045 },
  { id: 2015, book_id: 1046 },
  { id: 2016, book_id: 1046 },
  { id: 2017, book_id: 1046 },
  { id: 2018, book_id: 1047 },
  { id: 2019, book_id: 1047 },
  { id: 2020, book_id: 1047 },
  { id: 2021, book_id: 1048 },
  { id: 2022, book_id: 1048 },
  { id: 2023, book_id: 1048 },
  { id: 2024, book_id: 1049 },
  { id: 2025, book_id: 1049 },
  { id: 2026, book_id: 1049 },
  { id: 2027, book_id: 1050 },
  { id: 2028, book_id: 1050 },
  { id: 2029, book_id: 1050 },
  { id: 2030, book_id: 1051 },
  { id: 2031, book_id: 1051 },
  { id: 2032, book_id: 1051 },
  { id: 2033, book_id: 1052 },
  { id: 2034, book_id: 1052 },
  { id: 2035, book_id: 1052 },
  { id: 2036, book_id: 1053 },
  { id: 2037, book_id: 1053 },
  { id: 2038, book_id: 1053 },
  { id: 2039, book_id: 1054 },
  { id: 2040, book_id: 1054 },
  { id: 2041, book_id: 1054 },
  { id: 2042, book_id: 1055 },
  { id: 2043, book_id: 1055 },
  { id: 2044, book_id: 1055 },
  { id: 2045, book_id: 1056 },
  { id: 2046, book_id: 1056 },
  { id: 2047, book_id: 1056 },
  { id: 2048, book_id: 1057 },
  { id: 2049, book_id: 1057 },
  { id: 2050, book_id: 1057 },
  { id: 2051, book_id: 1058 },
  { id: 2052, book_id: 1058 },
  { id: 2053, book_id: 1058 },
  { id: 2054, book_id: 1059 },
  { id: 2055, book_id: 1059 },
  { id: 2056, book_id: 1059 },
  { id: 2057, book_id: 1060 },
  { id: 2058, book_id: 1060 },
  { id: 2059, book_id: 1060 },
  { id: 2060, book_id: 1061 },
  { id: 2061, book_id: 1061 },
  { id: 2062, book_id: 1061 },
  { id: 2063, book_id: 1062 },
  { id: 2064, book_id: 1062 },
  { id: 2065, book_id: 1062 },
  { id: 2066, book_id: 1063 },
  { id: 2067, book_id: 1063 },
  { id: 2068, book_id: 1063 },
  { id: 2069, book_id: 1064 },
  { id: 2070, book_id: 1064 },
  { id: 2071, book_id: 1064 },
  { id: 2072, book_id: 1065 },
  { id: 2073, book_id: 1065 },
  { id: 2074, book_id: 1065 },
  { id: 2075, book_id: 1066 },
  { id: 2076, book_id: 1066 },
  { id: 2077, book_id: 1066 },
  { id: 2078, book_id: 1067 },
  { id: 2079, book_id: 1067 },
  { id: 2080, book_id: 1067 },
  { id: 2081, book_id: 1068 },
  { id: 2082, book_id: 1068 },
  { id: 2083, book_id: 1068 },
  { id: 2084, book_id: 1069 },
  { id: 2085, book_id: 1069 },
  { id: 2086, book_id: 1069 },
  { id: 2087, book_id: 1070 },
  { id: 2088, book_id: 1070 },
  { id: 2089, book_id: 1070 },
  { id: 2090, book_id: 1071 },
  { id: 2091, book_id: 1071 },
  { id: 2092, book_id: 1071 },
  { id: 2093, book_id: 1072 },
  { id: 2094, book_id: 1072 },
  { id: 2095, book_id: 1072 },
  { id: 2096, book_id: 1073 },
  { id: 2097, book_id: 1073 },
  { id: 2098, book_id: 1073 },
  { id: 2099, book_id: 1074 },
  { id: 2100, book_id: 1074 },
  { id: 2101, book_id: 1074 },
  { id: 2102, book_id: 1075 },
  { id: 2103, book_id: 1075 },
  { id: 2104, book_id: 1075 },
  { id: 2105, book_id: 1076 },
  { id: 2106, book_id: 1076 },
  { id: 2107, book_id: 1076 },
  { id: 2108, book_id: 1077 },
  { id: 2109, book_id: 1077 },
  { id: 2110, book_id: 1077 },
  { id: 2111, book_id: 1078 },
  { id: 2112, book_id: 1078 },
  { id: 2113, book_id: 1078 },
  { id: 2114, book_id: 1079 },
  { id: 2115, book_id: 1079 },
  { id: 2116, book_id: 1079 },
  { id: 2117, book_id: 1080 },
  { id: 2118, book_id: 1080 },
  { id: 2119, book_id: 1080 },
  { id: 2120, book_id: 1081 },
  { id: 2121, book_id: 1081 },
  { id: 2122, book_id: 1081 },
  { id: 2123, book_id: 1082 },
  { id: 2124, book_id: 1082 },
  { id: 2125, book_id: 1082 },
  { id: 2126, book_id: 1083 },
  { id: 2127, book_id: 1083 },
  { id: 2128, book_id: 1083 },
  { id: 2129, book_id: 1084 },
  { id: 2130, book_id: 1084 },
  { id: 2131, book_id: 1084 },
  { id: 2132, book_id: 1085 },
  { id: 2133, book_id: 1085 },
  { id: 2134, book_id: 1085 },
  { id: 2135, book_id: 1086 },
  { id: 2136, book_id: 1086 },
  { id: 2137, book_id: 1086 },
  { id: 2138, book_id: 1087 },
  { id: 2139, book_id: 1087 },
  { id: 2140, book_id: 1087 },
  { id: 2141, book_id: 1088 },
  { id: 2142, book_id: 1088 },
  { id: 2143, book_id: 1088 },
  { id: 2144, book_id: 1089 },
  { id: 2145, book_id: 1089 },
  { id: 2146, book_id: 1089 },
  { id: 2147, book_id: 1090 },
  { id: 2148, book_id: 1090 },
  { id: 2149, book_id: 1090 },
  { id: 2150, book_id: 1091 },
  { id: 2151, book_id: 1091 },
  { id: 2152, book_id: 1091 },
  { id: 2153, book_id: 1092 },
  { id: 2154, book_id: 1092 },
  { id: 2155, book_id: 1092 },
  { id: 2156, book_id: 1093 },
  { id: 2157, book_id: 1093 },
  { id: 2158, book_id: 1093 },
  { id: 2159, book_id: 1094 },
  { id: 2160, book_id: 1094 },
  { id: 2161, book_id: 1094 },
  { id: 2162, book_id: 1095 },
  { id: 2163, book_id: 1095 },
  { id: 2164, book_id: 1095 },
  { id: 2165, book_id: 1096 },
  { id: 2166, book_id: 1096 },
  { id: 2167, book_id: 1096 },
  { id: 2168, book_id: 1097 },
  { id: 2169, book_id: 1097 },
  { id: 2170, book_id: 1097 },
  { id: 2171, book_id: 1098 },
  { id: 2172, book_id: 1098 },
  { id: 2173, book_id: 1098 },
  { id: 2174, book_id: 1099 },
  { id: 2175, book_id: 1099 },
  { id: 2176, book_id: 1099 },
  { id: 2177, book_id: 1100 },
  { id: 2178, book_id: 1100 },
  { id: 2179, book_id: 1100 },
  { id: 2180, book_id: 1101 },
  { id: 2181, book_id: 1101 },
  { id: 2182, book_id: 1101 },
  { id: 2183, book_id: 1102 },
  { id: 2184, book_id: 1102 },
  { id: 2185, book_id: 1102 },
  { id: 2186, book_id: 1103 },
  { id: 2187, book_id: 1103 },
  { id: 2188, book_id: 1103 },
  { id: 2189, book_id: 1104 },
  { id: 2190, book_id: 1104 },
  { id: 2191, book_id: 1104 },
  { id: 2192, book_id: 1105 },
  { id: 2193, book_id: 1105 },
  { id: 2194, book_id: 1105 },
  { id: 2195, book_id: 1106 },
  { id: 2196, book_id: 1106 },
  { id: 2197, book_id: 1106 },
  { id: 2198, book_id: 1107 },
  { id: 2199, book_id: 1107 },
  { id: 2200, book_id: 1107 },
  { id: 2201, book_id: 1108 },
  { id: 2202, book_id: 1108 },
  { id: 2203, book_id: 1108 },
  { id: 2204, book_id: 1109 },
  { id: 2205, book_id: 1109 },
  { id: 2206, book_id: 1109 },
  { id: 2207, book_id: 1110 },
  { id: 2208, book_id: 1110 },
  { id: 2209, book_id: 1110 },
];

const addBookDupe = async () => {
  try {
    for (const book_duplicate of dup) {
      await prisma.book_duplicate.create({
        data: book_duplicate,
      });
      console.log(`Book "${book_duplicate.book_id}" added.`);
    }
  } catch (error) {
    console.error("Error adding categories:", error);
  } finally {
    await prisma.$disconnect();
  }
};

addBookDupe();
