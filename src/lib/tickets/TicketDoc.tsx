import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import type { TeamPayload } from "@/lib/tickets/types";

const C = { cream:"#FFF7E6", red:"#B91C1C", gold:"#F59E0B", brown:"#7C2D12", ink:"#111827", white:"#FFFFFF", line:"#E5E7EB" };
function safe(v?: string){ return v && v.trim().length ? v : "—"; }

export function TicketDoc({ team, qrDataUrl, logoDataUrl, bannerDataUrl }:{ team:TeamPayload; qrDataUrl:string; logoDataUrl?:string; bannerDataUrl?:string; }){
  return (
    <Document>
      <Page size="A4" style={{ padding: 20, backgroundColor: C.cream }}>
        <View style={{ borderRadius: 18, overflow: "hidden", border: `2px solid ${C.red}`, backgroundColor: C.white }}>
          <View style={{ height: 150, position: "relative" }}>
            {bannerDataUrl ? <Image src={bannerDataUrl} style={{ width: "100%", height: "100%" }} /> : <View style={{ width:"100%", height:"100%", backgroundColor: C.red }} />}

            <View style={{ position:"absolute", left:16, top:16, right:16, flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start" }}>
              <View style={{ paddingRight: 110 }}>
                {logoDataUrl ? (
                  <View style={{ width: 84, height: 84, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", padding: 10, marginBottom: 10, alignItems:"center", justifyContent:"center" }}>
                    <Image src={logoDataUrl} style={{ width:"100%", height:"100%" }} />
                  </View>
                ) : null}
                <Text style={{ fontSize: 22, color: C.white, letterSpacing: 0.8 }}>THE BOOTROOM 2026</Text>
                <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>TEAM ENTRY PASS</Text>
              </View>

              <View style={{ width: 92, height: 92, borderRadius: 16, backgroundColor: C.white, border: "2px solid rgba(255,255,255,0.7)", padding: 8, alignItems:"center", justifyContent:"center" }}>
                <Image src={qrDataUrl} style={{ width: 74, height: 74 }} />
              </View>
            </View>

            <View style={{ position:"absolute", left:16, bottom:12, backgroundColor: C.gold, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 }}>
              <Text style={{ fontSize: 10, color: C.brown }}>SCAN AT CHECK-IN</Text>
            </View>
          </View>

          <View style={{ padding: 18 }}>
            <Text style={{ fontSize: 12, color: C.ink, marginBottom: 8 }}>Team Details</Text>

            <View style={{ border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
              {[
                ["Team No", String(team.teamNumber), "Company", safe(team.companyName)],
                ["Manager", `${safe(team.managerName)} (${safe(team.phone)})`, "Captain", `${safe(team.captainName)} (${safe(team.captainPhone)})`],
              ].map((row, i) => (
                <View key={i} style={{ flexDirection:"row", borderTop: i===0 ? "0px solid transparent" : `1px solid ${C.line}` }}>
                  <View style={{ width:"25%", padding:10, backgroundColor:"#FFF1D6" }}><Text style={{ fontSize: 9, color: C.brown }}>{row[0]}</Text></View>
                  <View style={{ width:"25%", padding:10 }}><Text style={{ fontSize: 9, color: C.ink }}>{row[1]}</Text></View>
                  <View style={{ width:"25%", padding:10, backgroundColor:"#FFF1D6" }}><Text style={{ fontSize: 9, color: C.brown }}>{row[2]}</Text></View>
                  <View style={{ width:"25%", padding:10 }}><Text style={{ fontSize: 9, color: C.ink }}>{row[3]}</Text></View>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 14 }}>
              <Text style={{ fontSize: 12, color: C.ink, marginBottom: 8 }}>Players (10)</Text>

              <View style={{ flexDirection:"row", backgroundColor:"#EFE7FF", border: `1px solid ${C.line}`, borderTopLeftRadius:12, borderTopRightRadius:12, paddingVertical:7, paddingHorizontal:10 }}>
                <Text style={{ width:"8%", fontSize: 9, color: C.ink }}>No</Text>
                <Text style={{ width:"42%", fontSize: 9, color: C.ink }}>Name</Text>
                <Text style={{ width:"12%", fontSize: 9, color: C.ink }}>Jersey</Text>
                <Text style={{ width:"23%", fontSize: 9, color: C.ink }}>Position</Text>
                <Text style={{ width:"15%", fontSize: 9, color: C.ink }}>Size</Text>
              </View>

              <View style={{ border: `1px solid ${C.line}`, borderTopWidth: 0, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                {team.players.map((p, idx) => (
                  <View key={idx} style={{ flexDirection:"row", paddingVertical:7, paddingHorizontal:10, borderTop: idx===0 ? "0px solid transparent" : `1px solid ${C.line}` }}>
                    <Text style={{ width:"8%", fontSize: 9, color: C.ink }}>{idx+1}</Text>
                    <Text style={{ width:"42%", fontSize: 9, color: C.ink }}>{safe(p.fullName)}</Text>
                    <Text style={{ width:"12%", fontSize: 9, color: C.ink }}>#{p.jerseyNumber}</Text>
                    <Text style={{ width:"23%", fontSize: 9, color: C.ink }}>{safe(p.position)}</Text>
                    <Text style={{ width:"15%", fontSize: 9, color: C.ink }}>{p.jerseySize}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 14, paddingTop: 10, borderTop: `1px dashed ${C.line}` }}>
              <Text style={{ fontSize: 9, color: C.brown }}>Keep this ticket safe. QR is required for verification. Details must match your registration.</Text>
              <Text style={{ fontSize: 8, color: "#6B7280", marginTop: 4 }}>Generated by The Bootroom Registration System.</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
