export default {


  content: [

    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",

  ],



  theme: {

    extend: {


      colors: {


        /* =====================
           BRAND
        ====================== */

        brandOrange:
          "var(--brand-orange)",


        brandBlue:
          "var(--brand-blue)",


        brandDark:
          "var(--brand-dark)",



        /* =====================
           APP
        ====================== */

        background:
          "var(--background)",


        surface:
          "var(--surface)",


        surfaceHover:
          "var(--surface-hover)",


        surfaceSoft:
          "var(--surface-soft)",



        /* =====================
           TEXT
        ====================== */

        text:
          "var(--text)",


        muted:
          "var(--text-muted)",



        /* =====================
           ACTIONS
        ====================== */

        primary:
          "var(--primary)",


        secondary:
          "var(--secondary)",


        accent:
          "var(--accent)",



        buttonSecondaryBg:
          "var(--button-secondary-bg)",


        buttonSecondaryText:
          "var(--button-secondary-text)",


        buttonSecondaryBorder:
          "var(--button-secondary-border)",



        /* =====================
           STATUS
        ====================== */

        success:
          "var(--success)",


        warning:
          "var(--warning)",


        danger:
          "var(--danger)",


        info:
          "var(--info)",



        successBg:
          "var(--success-bg)",


        warningBg:
          "var(--warning-bg)",


        dangerBg:
          "var(--danger-bg)",


        infoBg:
          "var(--info-bg)",


        neutralBg:
          "var(--neutral-bg)",



        successText:
          "var(--success-text)",


        warningText:
          "var(--warning-text)",


        dangerText:
          "var(--danger-text)",


        infoText:
          "var(--info-text)",


        neutralText:
          "var(--neutral-text)",



        successBorder:
          "var(--success-border)",


        warningBorder:
          "var(--warning-border)",


        dangerBorder:
          "var(--danger-border)",


        infoBorder:
          "var(--info-border)",


        neutralBorder:
          "var(--neutral-border)",



        border:
          "var(--border)",

      },



      borderRadius: {


        card:
          "var(--radius-card)",


        button:
          "var(--radius-button)",


        pill:
          "var(--radius-pill)",


      },



      boxShadow: {


        card:
          "var(--shadow-card)",


        cardHover:
          "var(--shadow-card-hover)",


      },


    },

  },


  plugins: [],


};