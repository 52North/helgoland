<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sml="http://www.opengis.net/sensorml/2.0"
                xmlns:gmd="http://www.isotc211.org/2005/gmd"
                version="2.0">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <div>
            <h3>
                Keywords
            </h3>
            <ul>
                <xsl:for-each select="sml:PhysicalComponent/sml:keywords/sml:KeywordList/sml:keyword">
                    <li>
                        <xsl:value-of select="."/>
                    </li>
                </xsl:for-each>
            </ul>
        </div>
        <div>
            <h3>
                Identifier
            </h3>
            <table border="0">
                <xsl:for-each select="sml:PhysicalComponent/sml:identification/sml:IdentifierList/sml:identifier">
                    <tr>
                        <td>
                            <xsl:value-of select="sml:Term/sml:label"/>
                        </td>
                        <td>
                            <xsl:value-of select="sml:Term/sml:value"/>
                        </td>
                    </tr>
                </xsl:for-each>
            </table>
        </div>
        <div>
            <h3>
                Contact
            </h3>
            <table border="0">
                <xsl:for-each select="sml:PhysicalComponent/sml:contacts/sml:ContactList/sml:contact">
                    <tr>
                        <td>
                            Role: <xsl:value-of select="gmd:CI_ResponsibleParty/gmd:role"/>
                        </td>
                        <td>
                            <xsl:value-of select="gmd:CI_ResponsibleParty/gmd:organisationName"/>
                            <xsl:if test="gmd:CI_ResponsibleParty/gmd:individualName">
                                (<xsl:value-of select="gmd:CI_ResponsibleParty/gmd:individualName"/>)
                            </xsl:if>
                        </td>
                    </tr>
                </xsl:for-each>
            </table>
        </div>
        <div>
            <h3>
                Description
            </h3>
            <xsl:element name="a">
                <xsl:attribute name="href">
                    <xsl:value-of select="sml:PhysicalComponent/sml:documentation/sml:DocumentList/sml:document/gmd:CI_OnlineResource/gmd:linkage/gmd:URL"/>
                </xsl:attribute>
                <xsl:value-of select="sml:PhysicalComponent/sml:documentation/sml:DocumentList/sml:document/gmd:CI_OnlineResource/gmd:description"/>
            </xsl:element>
        </div>
    </xsl:template>
</xsl:stylesheet>